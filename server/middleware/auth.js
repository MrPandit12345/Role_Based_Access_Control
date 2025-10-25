const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secret = process.env.JWT_SECRET || "secret-key";
const tokenExpiresIn = process.env.TOKEN_EXPIRES_IN || "8h";

async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.userId).select("-passwordHash").populate("role");
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.isLocked) return res.status(403).json({ message: "Account locked" });
    req.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    console.error("auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function authorize(moduleName, action) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ message: "Role is required" });
    const perm = (role.permissions || []).find(p => p.module === moduleName);
    if (!perm || !perm[action]) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

module.exports = { authenticateJWT, authorize, secret, tokenExpiresIn };
