const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controllers");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get("/detail/:roleId", controller.detail);
router.get("/edit/:roleId", controller.edit);
router.patch("/edit/:roleId", controller.editPatch);
router.patch("/del/:roleId", controller.delete);
router.get("/permission", controller.permission);
router.patch("/permission", controller.permissionPatch);

module.exports = router;
