const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controllers");

const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../middleware/admin/uploadToCloudinary");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  uploadMiddleware.uploadFields,
  controller.createPost,
);
router.get("/detail/:productId", controller.detail);
router.get("/edit/:productId", controller.edit);
router.patch(
  "/edit/:productId",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  uploadMiddleware.uploadFields,
  controller.editPatch,
);
router.patch("/del/:productId", controller.delete);
module.exports = router;
