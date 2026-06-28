import { useEffect, useRef } from "react";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const GooeyText = ({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className = "",
  textClassName = ""
}) => {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!texts?.length) {
      return undefined;
    }

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    const setMorph = (fraction) => {
      if (!text1Ref.current || !text2Ref.current) {
        return;
      }

      const safeFraction = Math.max(fraction, 0.0001);
      text2Ref.current.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`;
      text2Ref.current.style.opacity = `${Math.pow(safeFraction, 0.4) * 100}%`;

      const invertedFraction = Math.max(1 - fraction, 0.0001);
      text1Ref.current.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      text1Ref.current.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      if (!text1Ref.current || !text2Ref.current) {
        return;
      }

      text2Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "100%";
      text1Ref.current.style.filter = "";
      text1Ref.current.style.opacity = "0%";
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    const animate = () => {
      frameRef.current = window.requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    };

    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[textIndex % texts.length];
      text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
    }

    animate();

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={joinClasses("relative", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div className="flex min-h-[92px] items-center justify-center sm:min-h-[120px]" style={{ filter: "url(#threshold)" }}>
        <span
          ref={text1Ref}
          className={joinClasses(
            "absolute inline-block select-none text-center text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl",
            textClassName
          )}
        />
        <span
          ref={text2Ref}
          className={joinClasses(
            "absolute inline-block select-none text-center text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl",
            textClassName
          )}
        />
      </div>
    </div>
  );
};

export default GooeyText;
