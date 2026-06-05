const Category = require("../../models/category.model");

const converToSlugHelpers = require("../../helpers/convertToSlug");
const searchHelpers = require("../../helpers/search");
const filterHelpers = require("../../helpers/filter");
const paginationHelpers = require("../../helpers/pagination");
const { tree } = require("../../helpers/create-tree");
const systemConfig = require("../../config/system");

// [GET] /admin/categories
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

  const countCategory = await Category.countDocuments(find);

  // PAGINATION
  objectPagination = await paginationHelpers.pagination(
    objectPagination,
    req.query,
  );

  objectPagination.totalPage = Math.ceil(
    countCategory / objectPagination.limitItem,
  );

  const categories = await Category.find(find)
    .sort(objectFilter.sort)
    .limit(objectFilter.limit)
    .skip(objectPagination.skip);
  // const newCategories = tree(categories);
  res.render("admin/pages/category/index", {
    pageTitle: "Quản lý danh mục sản phẩm",
    categories: categories,
    page: "category",
    totalPage: objectPagination.totalPage,
    currentPage: objectPagination.currentPage,
  });
};

// [GET] /admin/categories/create
module.exports.create = async (req, res) => {
  const categories = await Category.find({
    deleted: false,
  });
  res.render("admin/pages/category/create", {
    pageTitle: "Tạo mới danh mục",
    categories: categories,
  });
};

// [POST] /admin/categories/create
module.exports.createPost = async (req, res) => {
  let position = await Category.countDocuments();
  position += 1;
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    req.body.position = position;
  }
  const data = new Category(req.body);
  await data.save();
  res.redirect(`${systemConfig.prefixAdmin.path}/categories`);
};

// [GET] /admin/categories/detail/:categoryId
module.exports.detail = async (req, res) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findOne({
    deleted: false,
    _id: categoryId,
  });
  const parentId = category.parentId;
  if (parentId) {
    const parent = await Category.findOne({
      deleted: false,
      _id: category.parentId,
    }).select("title");
    if (parent) {
      category.parent = parent;
    }
  }

  res.render("admin/pages/category/detail", {
    pageTitle: "Chi tiết danh mục",
    category: category,
  });
};

// [GET] /admin/categories/edit/:categoryId
module.exports.edit = async (req, res) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findOne({
    deleted: false,
    _id: categoryId,
  });
  const categories = await Category.find({
    deleted: false,
  });
  category.categories = categories;
  res.render("admin/pages/category/edit", {
    pageTitle: "Chỉnh sửa danh mục",
    category: category,
  });
};

// [PATCH] /admin/categories/edit/:categoryId
module.exports.editPatch = async (req, res) => {
  const categoryId = req.params.categoryId;
  let position = await Category.countDocuments();
  position += 1;
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    req.body.position = position;
  }
  await Category.updateOne(
    {
      _id: categoryId,
    },
    req.body,
  );
  res.redirect(req.get("Referer"));
};

// [PATCH] /admin/categories/del/:categoryId
module.exports.delete = async (req, res) => {
  const categoryId = req.params.categoryId;
  await Category.updateOne(
    {
      _id: categoryId,
    },
    {
      deleted: true,
    },
  );
  res.redirect(req.get("Referer"));
};
