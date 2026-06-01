const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controllers");
const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../middleware/client/uploadToCloudinary");

router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/register", controller.register);
router.post("/register", controller.registerPost);
router.get("/logout", controller.logout);
router.get("/profile", controller.profile);
router.post(
  "/profile",
  upload.single("avatar"),
  uploadMiddleware.uploadSingle,
  controller.profilePost,
);
router.get("/forgot-password", controller.forgotPassword);
router.post("/forgot-password", controller.forgotPasswordPost);
router.get("/otp-password", controller.otpPassword);
router.post("/otp-password", controller.otpPasswordPost);
router.get("/reset-password", controller.resetPassword);
router.post("/reset-password", controller.resetPasswordPost);
router.get("/orders", controller.order);
module.exports = router;
