const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/payment.controllers");

router.post("/momo", controller.paymentMomo);

module.exports = router;
