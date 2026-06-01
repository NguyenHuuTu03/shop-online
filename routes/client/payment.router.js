const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/payment.controllers");

router.post("/momo", controller.paymentMomo);
router.get("/momo-return", controller.momoReturn);
router.post("/vnpay", controller.paymentVNPay);
router.get("/vnpay-return", controller.vnpayReturn);

module.exports = router;
