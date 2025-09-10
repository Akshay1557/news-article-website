const User = require("../models/User");
const passport = require("passport");
const path = require("path");
const multer = require("multer");



// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/profiles");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

exports.upload = multer({ storage });


// Show profile page
exports.showProfile = (req, res) => {
  if (!req.user) {
    return res.redirect("/users/login");
  }
  res.render("users/profile", { user: req.user });
};

// Handle profile photo upload
exports.uploadProfilePhoto = async (req, res) => {
  if (!req.user) return res.redirect("/users/login");

  try {
    req.user.photo = "/uploads/profiles/" + req.file.filename;
    await req.user.save();
    res.redirect("/users/profile");
  } catch (err) {
    res.status(400).send("Error uploading profile photo: " + err.message);
  }
};


// Show register form
exports.showRegisterForm = (req, res) => {
  res.render("users/register");
};

// Handle register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email });
    await User.register(user, password); // passport-local-mongoose handles hashing

    res.redirect("/users/login");
  } catch (err) {
    res.status(400).send("Error registering user: " + err.message);
  }
};

// Show login form
exports.showLoginForm = (req, res) => {
  res.render("users/login");
};

// Handle login
exports.loginUser = passport.authenticate("local", {
  successRedirect: "/articles",
  failureRedirect: "/users/login",
  failureFlash: true,                        // 👈 enables error messages
});

// Handle logout
exports.logoutUser = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/articles");
  });
};
