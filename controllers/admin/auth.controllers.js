const User = require("../../models/users.model");
const Role = require("../../models/roles.model");
const md5 = require("md5");
const generateHelpers = require("../../helpers/generate");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập",
  });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const exitsEmail = await User.findOne({
    deleted: false,
    email: email,
  });
  if (!exitsEmail) {
    req.flash("error", "Không tồn tại email!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (exitsEmail.roleId) {
    const role = await Role.findOne({
      _id: exitsEmail.roleId,
    });
    if (role.title == "User") {
      req.flash("error", "Tài khoản không có quyền truy cập!");
      res.redirect(req.get("Referer"));
      return;
    }
  }

  if (md5(req.body.password) != exitsEmail.password) {
    req.flash("error", "Mật khẩu không đúng!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (exitsEmail.status == "inactive") {
    req.flash("error", "Tài khoản không hoạt động!");
    res.redirect(req.get("Referer"));
    return;
  }
  res.cookie("tokenUser", exitsEmail.tokenUser);
  res.redirect(`${systemConfig.prefixAdmin.path}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect(`${systemConfig.prefixAdmin.path}/auth/login`);
};

// [GET] /admin/my-account
module.exports.profile = async (req, res) => {
  const token = req.cookies.tokenUser;
  const user = await User.findOne({
    deleted: false,
    tokenUser: token,
  }).select("-password");
  const role = await Role.findOne({
    deleted: false,
    _id: user.roleId,
  });
  user.role = role;

  res.render("admin/pages/auth/profile", {
    pageTitle: "Thông tin tài khoản",
    user: user,
  });
};

// [GET] /admin/my-account/edit
module.exports.editProfile = async (req, res) => {
  const token = req.cookies.tokenAdmin;
  const user = await User.findOne({
    deleted: false,
    tokenAdmin: token,
  }).select("-password");
  const role = await Role.findOne({
    deleted: false,
    _id: user.roleId,
  });
  user.role = role;
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/auth/editProfile", {
    pageTitle: "Thông tin tài khoản",
    user: user,
    roles: roles,
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editProfilePatch = async (req, res) => {
  const email = req.body.email;
  const token = req.cookies.tokenUser;
  const exitsEmail = await User.findOne({
    deleted: false,
    email: email,
    tokenUser: { $ne: token },
  });
  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  const user = await User.findOne({
    tokenUser: token,
  });
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    req.body.password = user.password;
  }
  await User.updateOne(
    {
      tokenUser: token,
    },
    req.body,
  );
  res.redirect(req.get("Referer"));
};
