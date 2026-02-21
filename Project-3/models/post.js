const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  imageUrl: String,
  public_id: String,
  caption: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userp3"
  }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);