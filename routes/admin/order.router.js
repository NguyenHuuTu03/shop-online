const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order.controllers");

router.get("/", controller.index);
router.get("/detail/:orderId", controller.detail);
router.get("/edit/:orderId", controller.edit);
router.patch("/edit/status/:orderId", controller.editStatus);

module.exports = router;
