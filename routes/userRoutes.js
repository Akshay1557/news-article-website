const express = require("express");
const {
  showRegisterForm,
  registerUser,
  showLoginForm,
  loginUser,
  logoutUser,
  showProfile,
  uploadProfilePhoto,
  upload
} = require("../controllers/userController");

const router = express.Router();

router.get("/register", showRegisterForm);
router.post("/register", registerUser);

router.get("/login", showLoginForm);
router.post("/login", loginUser);

router.get("/logout", logoutUser);

// Profile routes
router.get("/profile", showProfile);
router.post("/profile/photo", upload.single("photo"), uploadProfilePhoto);

module.exports = router;
