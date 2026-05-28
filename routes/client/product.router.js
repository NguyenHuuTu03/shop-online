const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/product.controllers");

router.get("/", controller.index);
router.get("/:slugCategory", controller.productCategory);
router.get("/detail/:slugProduct", controller.productDetail);

module.exports = router;
