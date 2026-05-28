const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controllers");

router.get("/", controller.index);

router.post("/cart-json", controller.cartJson);
router.get("/mini-cart", controller.miniCart);
router.patch("/update", controller.update);
router.delete("/delete/:productId", controller.delete);
module.exports = router;
