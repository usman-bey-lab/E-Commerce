import jwt from "jsonwebtoken";

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    // Distinguish expired tokens from invalid ones
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ success: false, error: "Invalid token." });
  }
};

export default fetchUser;