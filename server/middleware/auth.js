import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // 🔑 Attach user ID to request
    // Fetch user details and attach to req.user
    const user = await User.findById(decoded.id).select("name email");
    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid token" });
  }
};

export default auth;
