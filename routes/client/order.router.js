const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/order.controllers");

router.get("/", controller.order);
router.post("/", controller.orderPost);
router.get("/success/:orderId", controller.orderSuccess);
router.post("/order-json", controller.orderJson);
router.patch("/delete/:orderId", controller.delete);

module.exports = router;
