import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const getInitials = (fullName = "") =>
  fullName
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

const menuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "profile", label: "Profile" },
  { id: "logout", label: "Logout" }
];

const ProfileMenu = ({ user, activePage, onNavigate, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (itemId) => {
    setIsOpen(false);

    if (itemId === "logout") {
      onLogout?.();
      return;
    }

    onNavigate?.(itemId);
  };

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        type="button"
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-3 rounded-full border border-cyan-500/10 bg-slate-950/45 px-3 py-2 text-left backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-slate-950/60"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500 text-sm font-bold text-slate-950 shadow-[0_12px_30px_rgba(14,165,233,0.25)]">
          {getInitials(user?.fullName || user?.email || "HS")}
        </div>
        <div className="hidden text-sm sm:block">
          <p className="font-medium text-white">{user?.fullName || "HireSense User"}</p>
          <p className="text-xs text-slate-400">{user?.email || "Workspace member"}</p>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-30 mt-3 w-56 rounded-3xl border border-cyan-500/15 bg-slate-950/90 p-2 shadow-[0_26px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl"
          >
            <div className="border-b border-white/8 px-3 py-3">
              <p className="text-sm font-semibold text-white">{user?.fullName || "Workspace user"}</p>
              <p className="mt-1 text-xs text-slate-400">{user?.email || "Signed in"}</p>
            </div>

            <div className="mt-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm transition ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-200 font-semibold border border-cyan-500/10"
                        : "text-slate-200 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive ? <span className="text-xs text-cyan-200">Open</span> : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
