const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", authController.createUser);

router.get("/verify-email/:token", authController.verifyEmail);

router.post(
  "/resend-verification-email",
  authController.resendVerificationEmail
);

router.post("/login", authController.userLogin);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
