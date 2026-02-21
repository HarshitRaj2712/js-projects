# 📸 Mini Instagram Clone (Project 3)

A full-stack social media web application built using **Node.js, Express, MongoDB, JWT, EJS, and Cloudinary**.

Users can register, login, upload images, edit posts, delete posts, and view a paginated feed.

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Multer
- Cloudinary

### Frontend
- EJS (Server-side rendering)
- HTML
- CSS

---

## 📂 Features

- 🔐 JWT Authentication (Cookie-based)
- 📝 Register & Login
- 📸 Upload Image Posts (Cloudinary Storage)
- ✏ Edit Own Posts
- 🗑 Delete Own Posts
- 👀 Paginated Feed (5 posts per page)
- 🚪 Logout
- 🔒 Owner-based Authorization

---

## 🗂 Database Schema

### User Schema

```js
{
  username: String,
  email: String,
  password: String
}
```
---

## 🔐 Authentication Flow (Code)

This project uses JWT-based authentication stored in HTTP cookies.

---

### 1️⃣ Login Route (Generate JWT)

```js
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.send("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true
  });

  res.redirect("/feed");
});
