const express = require("express");
const {
  showRegisterForm,
  registerUser,
  showLoginForm,
  loginUser,
  logoutUser,
  showProfile,
  updateProfile,
  upload,
  showForgotPasswordForm,
  handleForgotPassword,
  showResetPasswordForm,
  handleResetPassword
} = require("../controllers/userController");

const router = express.Router();

router.get("/register", showRegisterForm);
router.post("/register", registerUser);

router.get("/login", showLoginForm);
router.post("/login", loginUser);

router.get("/logout", logoutUser);

// Profile routes
router.get("/profile", showProfile);
router.post("/profile/update", upload.single("photo"), updateProfile);

// ✅ Forgot password + reset routes
router.get("/forgot-password", showForgotPasswordForm);
router.post("/forgot-password", handleForgotPassword);
router.get("/reset-password/:userId", showResetPasswordForm);
router.post("/reset-password/:userId", handleResetPassword);

module.exports = router;
