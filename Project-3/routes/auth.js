const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");


router.get("/register", (req, res) => {
  res.render("register");
});


router.post("/register", async (req, res) => {

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  res.redirect("/login");
});


router.get("/login", (req, res) => {
  res.render("login");
});


router.post("/login", async (req, res) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.send("Invalid credentials");

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token);
  res.redirect("/feed");
});

module.exports = router;