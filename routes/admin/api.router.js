const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/api.controllers");

router.patch("/change-status", controller.changeStatus);

module.exports = router;
