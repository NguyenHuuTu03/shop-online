const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/search.controllers");

router.get("/:type", controller.index);

module.exports = router;
