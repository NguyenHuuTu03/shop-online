const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/general.controllers");

const multer = require("multer");
const upload = multer();
const uploadMiddleware = require("../../middleware/admin/uploadToCloudinary");

router.get("/general", controller.general);
router.patch(
  "/general",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "sideBar", maxCount: 10 },
  ]),
  uploadMiddleware.uploadFields,
  controller.generalPost,
);

module.exports = router;
