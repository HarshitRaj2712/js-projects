const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function (req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Fetch full user from DB
    const user = await User.findById(decoded.id);

    if (!user) return res.redirect("/login");

    req.user = user;  // now contains username, email, etc.

    next();
  } catch (err) {
    res.redirect("/login");
  }
};