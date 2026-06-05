const User = require("../../models/users.model");
const Role = require("../../models/roles.model");
const md5 = require("md5");

const converToSlugHelpers = require("../../helpers/convertToSlug");
const searchHelpers = require("../../helpers/search");
const filterHelpers = require("../../helpers/filter");
const paginationHelpers = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const generateHelpers = require("../../helpers/generate");

// [GET] /admin/users
module.exports.index = async (req, res) => {
  let find = { deleted: false };

  let objectFilter = {
    sort: {},
    limit: 10,
  };

  let objectPagination = {
    currentPage: 1,
    limitItem: objectFilter.limit,
  };

  // SEARCH + FILTER (luôn chạy)
  find = searchHelpers.search(find, req.query);
  objectFilter = filterHelpers.filterAdmin(find, req.query, objectFilter);

  const countUser = await User.countDocuments(find);

  // PAGINATION
  objectPagination = await paginationHelpers.pagination(
    objectPagination,
    req.query,
  );

  objectPagination.totalPage = Math.ceil(
    countUser / objectPagination.limitItem,
  );

  const users = await User.find(find)
    .sort(objectFilter.sort)
    .limit(objectFilter.limit)
    .skip(objectPagination.skip);

  for (const user of users) {
    if (user.roleId) {
      const role = await Role.findOne({
        _id: user.roleId,
      }).select("title");

      if (role) {
        user.role = role;
      }
    }
  }

  res.render("admin/pages/users/index", {
    pageTitle: "Quản lý danh mục sản phẩm",
    users: users,
    page: "user",
    totalPage: objectPagination.totalPage,
    currentPage: objectPagination.currentPage,
  });
};

// [GET] /admin/users/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/users/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

// [POST] /admin/users/create
module.exports.createPost = async (req, res) => {
  const email = req.body.email;
  const exitsUser = await User.findOne({
    deleted: false,
    email: email,
  });
  if (exitsUser) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(req.get("Referer"));
    return;
  }
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  }
  req.body.tokenUser = generateHelpers.generateRandomString(30);

  const dataUser = new User(req.body);
  await dataUser.save();
  res.redirect(`${systemConfig.prefixAdmin.path}/users`);
};

// [GET] /admin/users/detail/:userId
module.exports.detail = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({
    deleted: false,
    _id: userId,
  }).select("-password");
  if (user.roleId) {
    const role = await Role.findOne({
      _id: user.roleId,
    }).select("title");
    if (role) {
      user.role = role;
    }
  }

  res.render("admin/pages/users/detail", {
    pageTitle: "Chi tiết người dùng",
    userDetail: user,
  });
};

// [GET] /admin/users/edit/:userId
module.exports.edit = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({
    deleted: false,
    _id: userId,
  }).select("-password");

  if (user.roleId) {
    const role = await Role.findOne({
      _id: user.roleId,
    });
    user.role = role;
  }

  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/users/edit", {
    pageTitle: "Chi tiết người dùng",
    user: user,
    roles: roles,
  });
};

// [PATCH] /admin/users/edit/:userId
module.exports.editPatch = async (req, res) => {
  const userId = req.params.userId;
  const exitsUser = await User.findOne({
    deleted: false,
    email: req.body.email,
    _id: { $ne: userId },
  });
  const user = await User.findOne({
    deleted: false,
    _id: userId,
  });
  if (exitsUser) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    req.body.password = user.password;
  }
  await User.updateOne(
    {
      _id: userId,
    },
    req.body,
  );
  res.redirect(req.get("Referer"));
};

// [PATCH] /admin/users/del/:userId
module.exports.delete = async (req, res) => {
  const userId = req.params.userId;
  await User.updateOne(
    {
      _id: userId,
    },
    {
      deleted: true,
    },
  );
  res.redirect(req.get("Referer"));
};
