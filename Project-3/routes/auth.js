const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const transporter = require("../config/mailer");


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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.send("Invalid credentials");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.send("Invalid credentials");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token);
    res.redirect("/feed");
  } catch (err) {
    res.send("Something went wrong");
  }
});

//use for password reset via URL token

// router.get("/forgot-password", (req, res) => {
//   res.render("forgot-password");
// });

// router.post("/forgot-password", async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return res.send("User not found");
//   }

//   const token = crypto.randomBytes(32).toString("hex");

//   user.resetToken = token;
//   user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

//   await user.save();

//   const resetUrl = `http://localhost:3000/reset-password/${token}`;

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: user.email,
//     subject: "Password Reset",
//     html: `
//       <h3>Password Reset Request</h3>
//       <p>Click below link to reset password:</p>
//       <a href="${resetUrl}">${resetUrl}</a>
//       <p>This link expires in 15 minutes.</p>
//     `
//   });

//   res.send("Password reset link sent to email.");
// });

// router.get("/reset-password/:token", async (req, res) => {
//   const user = await User.findOne({
//     resetToken: req.params.token,
//     resetTokenExpire: { $gt: Date.now() }
//   });

//   if (!user) {
//     return res.send("Invalid or expired token");
//   }

//   res.render("reset-password", { token: req.params.token });
// });

// router.post("/reset-password/:token", async (req, res) => {
//   const user = await User.findOne({
//     resetToken: req.params.token,
//     resetTokenExpire: { $gt: Date.now() }
//   });

//   if (!user) {
//     return res.send("Invalid or expired token");
//   }

//   user.password = req.body.password;
//   user.resetToken = undefined;
//   user.resetTokenExpire = undefined;

//   await user.save();

//   res.redirect("/login");
// });

//use for password reset via otp
router.get("/forgot-otp", (req, res) => {
  res.render("forgot-otp");
});

router.post("/forgot-otp", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.send("User not found");

  // const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp = crypto.randomInt(100000, 999999).toString();

  user.otp = otp;
  user.otpExpire = Date.now() + 3 * 60 * 1000; // 3 minutes

  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your OTP Code",
    html: `
      <h2>Password Reset OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 3 minutes.</p>
    `
  });

  res.redirect(`/verify-otp/${user.email}`);
});

router.get("/verify-otp/:email", (req, res) => {
  res.render("verify-otp", { email: req.params.email });
});

router.post("/verify-otp/:email", async (req, res) => {
  const user = await User.findOne({
    email: req.params.email,
    otp: req.body.otp,
    otpExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.send("Invalid or expired OTP");
  }

  user.password = req.body.password;
  user.otp = undefined;
  user.otpExpire = undefined;

  await user.save();

  res.redirect("/login");
});

module.exports = router;