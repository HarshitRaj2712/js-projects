const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  // resetToken: String,  //for password reset link
  // resetTokenExpire: Date

  otp: String,            //for password reset OTP
  otpExpire: Date
});

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

// module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.model("Userp3", userSchema);