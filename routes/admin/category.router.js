const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/category.controllers");

const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../middleware/admin/uploadToCloudinary");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadMiddleware.uploadSingle,
  controller.createPost,
);
router.get("/detail/:categoryId", controller.detail);
router.get("/edit/:categoryId", controller.edit);
router.patch(
  "/edit/:categoryId",
  upload.single("thumbnail"),
  uploadMiddleware.uploadSingle,
  controller.editPatch,
);
router.patch("/del/:categoryId", controller.delete);

module.exports = router;
