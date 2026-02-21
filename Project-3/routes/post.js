const express = require("express");
const router = express.Router();
const multer = require("multer");

const Post = require("../models/post");
const authMiddleware = require("../middleware/auth");


const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "project3",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage: storage });


router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalPosts / limit);

    res.render("feed", {
      posts,
      currentUser: req.user.id,
      currentPage: page,
      totalPages,
      username: req.user.username
    });

  } catch (err) {
    console.log(err);
    res.redirect("/feed");
  }
});

router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      await Post.create({
        imageUrl: req.file.path,     
        public_id: req.file.filename, 
        caption: req.body.caption,
        user: req.user.id
      });

      res.redirect("/feed");
    } catch (err) {
      console.log(err);
      res.redirect("/feed");
    }
  }
);


router.post("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.redirect("/feed");

    if (post.user.toString() === req.user.id) {

   
      if (post.public_id) {
        await cloudinary.uploader.destroy(post.public_id);
      }

  
      await post.deleteOne();
    }

    res.redirect("/feed");

  } catch (err) {
    console.log(err);
    res.redirect("/feed");
  }
});


router.get("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.redirect("/feed");

    if (post.user.toString() !== req.user.id) {
      return res.redirect("/feed");
    }

    res.render("edit", { post });

  } catch (err) {
    console.log(err);
    res.redirect("/feed");
  }
});


router.post(
  "/edit/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) return res.redirect("/feed");

      if (post.user.toString() !== req.user.id) {
        return res.redirect("/feed");
      }

      
      post.caption = req.body.caption;

      if (req.file) {

        
        if (post.public_id) {
          await cloudinary.uploader.destroy(post.public_id);
        }

       
        post.imageUrl = req.file.path;
        post.public_id = req.file.filename;
      }

      await post.save();

      res.redirect("/feed");

    } catch (err) {
      console.log(err);
      res.redirect("/feed");
    }
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;