import jwt from "jsonwebtoken"

const fetchAdmin = (req, res, next) => {
  const token = req.headers["admin-token"]
  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied" })
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET
    )
    if (!decoded.admin) {
      return res.status(401).json({ success: false, error: "Not authorized" })
    }
    req.admin = decoded.admin
    next()
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" })
  }
}

export default fetchAdmin