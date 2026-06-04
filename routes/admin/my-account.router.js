const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controllers");

const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../middleware/admin/uploadToCloudinary");

router.get("/", controller.profile);
router.get("/edit", controller.editProfile);
router.patch(
  "/edit",
  upload.single("avatar"),
  uploadMiddleware.uploadSingle,
  controller.editProfilePatch,
);

module.exports = router;
