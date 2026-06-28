const crypto = require("crypto");

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

const hashPassword = (password) => {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedValue) => {
  const [salt, storedHash] = (storedValue || "").split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const calculatedHash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(storedHash, "hex"),
    Buffer.from(calculatedHash, "hex")
  );
};

module.exports = {
  hashPassword,
  verifyPassword
};
