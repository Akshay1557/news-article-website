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



// ✅ Update profile (name, email, photo)
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/users/login");

    const { name, email } = req.body;

    // update fields
    req.user.name = name || req.user.name;
    req.user.email = email || req.user.email;

    // if new photo uploaded
    if (req.file) {
      req.user.photo = "/uploads/profiles/" + req.file.filename;
    }

    await req.user.save();
    res.redirect("/users/profile");
  } catch (err) {
    res.status(400).send("Error updating profile: " + err.message);
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
  failureFlash: true, // 👈 enables error messages
});

// Handle logout
exports.logoutUser = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/articles");
  });
};



// ........ password updation part ..........     //


// Show forgot password form
exports.showForgotPasswordForm = (req, res) => {
  res.render("users/forgot-password");
};

// Handle forgot password (very simple: redirect to reset page)
exports.handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("No user found with that email.");
    }

    // Instead of email (for now), redirect directly to reset page
    res.redirect(`/users/reset-password/${user._id}`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

// Show reset password form
exports.showResetPasswordForm = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).send("Invalid reset link");
  }

  res.render("users/reset-password", { userId });
};

// Handle reset password
exports.handleResetPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).send("User not found");

    // passport-local-mongoose helper
    await user.setPassword(password);
    await user.save();

    res.redirect("/users/login");
  } catch (err) {
    res.status(400).send("Error resetting password: " + err.message);
  }
};
