const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/ship.controllers");

router.get("/", controller.index);
router.get("/list", controller.list);
router.patch("/ship", controller.ship);
router.patch("/change-payment-status", controller.changePaymentStatus);
router.get("/detail/:orderId", controller.detail);

module.exports = router;
