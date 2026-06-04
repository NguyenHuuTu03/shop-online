const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/user.controllers");

const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../middleware/admin/uploadToCloudinary");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadMiddleware.uploadSingle,
  controller.createPost,
);
router.get("/detail/:userId", controller.detail);
router.get("/edit/:userId", controller.edit);
router.patch(
  "/edit/:userId",
  upload.single("avatar"),
  uploadMiddleware.uploadSingle,
  controller.editPatch,
);
router.patch("/del/:userId", controller.delete);

module.exports = router;
