const User = require("../models/User");
const passport = require("passport");

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
});

// Handle logout
exports.logoutUser = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
};
