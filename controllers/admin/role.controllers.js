const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    roles: roles,
    page: "role",
  });
};

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo mới nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const roleName =
    req.body.title.charAt(0).toUpperCase() + req.body.title.slice(1);
  req.body.title = roleName;

  const exitRole = await Role.findOne({
    deleted: false,
    title: req.body.title,
  });
  if (exitRole) {
    req.flash("error", "Quyền đã tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  const dataRole = new Role(req.body);
  await dataRole.save();
  res.redirect(`${systemConfig.prefixAdmin.path}/roles`);
};

// [GET] /admin/roles/detail/:roleId
module.exports.detail = async (req, res) => {
  const roleId = req.params.roleId;
  const role = await Role.findOne({
    deleted: false,
    _id: roleId,
  });
  res.render("admin/pages/roles/detail", {
    pageTitle: "Chi tiết quyền",
    role: role,
  });
};

// [GET] // admin/roles/edit/:roleId
module.exports.edit = async (req, res) => {
  const roleId = req.params.roleId;
  const role = await Role.findOne({
    _id: roleId,
    deleted: false,
  });
  res.render("admin/pages/roles/edit", {
    pageTitle: "Chỉnh sửa quyền",
    role: role,
  });
};

// [PATCH] // admin/roles/edit/:roleId
module.exports.editPatch = async (req, res) => {
  const roleId = req.params.roleId;
  const roleName =
    req.body.title.charAt(0).toUpperCase() + req.body.title.slice(1);
  req.body.title = roleName;

  const exitRole = await Role.findOne({
    deleted: false,
    title: req.body.title,
    _id: { $ne: roleId },
  });
  if (exitRole) {
    req.flash("error", "Quyền đã tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }

  await Role.updateOne(
    {
      _id: roleId,
    },
    req.body,
  );
  res.redirect(req.get("Referer"));
};

// [PATCH] /admin/roles/del/:roleId
module.exports.delete = async (req, res) => {
  await Role.updateOne(
    {
      _id: req.params.roleId,
    },
    {
      deleted: true,
    },
  );
  res.redirect(req.get("Referer"));
};

// [GET] /admin/roles/permission
module.exports.permission = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/roles/permission", {
    pageTitle: "Phân quyền",
    roles: roles,
  });
};

// [PATCH] /admin/roles/permission
module.exports.permissionPatch = async (req, res) => {
  for (const item of req.body) {
    await Role.updateOne(
      {
        _id: item.id,
      },
      {
        permissions: item.permissions,
      },
    );
  }
  res.json({
    code: 200,
    message: "Thành công!",
  });
};
