const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); // Extract token from header
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = verified; // Attach user data to request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
