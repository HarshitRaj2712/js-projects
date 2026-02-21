const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.use("/", require("./routes/auth"));
app.use("/", require("./routes/post"));

app.get("/", (req, res) => {
    res.redirect("/feed");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});