const Products = require("../../models/product.model");
const Category = require("../../models/category.model");
const Brand = require("../../models/brand.model");

const converToSlugHelpers = require("../../helpers/convertToSlug");
const searchHelpers = require("../../helpers/search");
const filterHelpers = require("../../helpers/filter");
const paginationHelpers = require("../../helpers/pagination");

const systemConfig = require("../../config/system");
const Brands = require("../../models/brand.model");

// [GET] /admin/products
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

  // COUNT (luôn chạy)
  const countProducts = await Products.countDocuments(find);

  // PAGINATION
  objectPagination = await paginationHelpers.pagination(
    objectPagination,
    req.query,
  );

  objectPagination.totalPage = Math.ceil(
    countProducts / objectPagination.limitItem,
  );

  const products = await Products.find(find)
    .sort(objectFilter.sort)
    .limit(objectFilter.limit)
    .skip(objectPagination.skip);
  res.render("admin/pages/products/index", {
    pageTitle: "Quản lý sản phẩm",
    products: products,
    totalPage: objectPagination.totalPage,
    currentPage: objectPagination.currentPage,
  });
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const categories = await Category.find({
    deleted: false,
  });
  const brands = await Brand.find({
    deleted: false,
  });
  res.render("admin/pages/products/create", {
    pageTitle: "Tạo mới sản phẩm",
    categories: categories,
    brands: brands,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  let position = await Products.countDocuments();
  position += 1;
  const dataProduct = {
    title: req.body.title,
    price: parseInt(req.body.price),
    discount: parseInt(req.body.discount),
    description: req.body.description,
    warranty: req.body.warranty,
    shippingInfo: req.body.shippingInfo,
    categoryId: req.body.categoryId,
    brandId: req.body.brandId,
    status: req.body.status,
    featured: req.body.featured,
    position: position,
    tags: req.body.tags,
    specifications: req.body.specifications,
    variants: req.body.variants,
    thumbnail: req.body.thumbnail[0],
    images: req.body.images,
  };
  const product = new Products(dataProduct);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin.path}/products`);
};

// [GET] /admin/products/detail/:productId
module.exports.detail = async (req, res) => {
  const productId = req.params.productId;
  const product = await Products.findOne({
    deleted: false,
    _id: productId,
  });
  const category = await Category.findOne({
    deleted: false,
    _id: product.categoryId,
  });
  product.category = category;

  const brand = await Brands.findOne({
    deleted: false,
    _id: product.brandId,
  });
  product.brand = brand;
  res.render("admin/pages/products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product: product,
  });
};

// [GET] /admin/products/edit/:productId
module.exports.edit = async (req, res) => {
  const productId = req.params.productId;
  const product = await Products.findOne({
    deleted: false,
    _id: productId,
  });
  const categories = await Category.find({
    deleted: false,
  });
  const brands = await Brands.find({
    deleted: false,
  });
  res.render("admin/pages/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product,
    categories: categories,
    brands: brands,
  });
};

// [PATCH] /admin/products/edit/:productId
module.exports.editPatch = async (req, res) => {
  if (Array.isArray(req.body.variants[0].color)) {
    const data = req.body.variants[0];
    req.body.variants = data.color.map((_, index) => ({
      color: data.color[index],
      ram: data.ram[index],
      storage: data.storage[index],
      price: Number(data.price[index]),
      stock: Number(data.stock[index]),
    }));
  }
  if (req.body.thumbnail) {
    req.body.thumbnail = req.body.thumbnail[0];
  }
  await Products.updateOne(req.body);
  res.redirect(req.get("Referer"));
};

// [PATCH] /admin/products/del/productId
module.exports.delete = async (req, res) => {
  const productId = req.params.productId;
  await Products.updateOne(
    {
      _id: productId,
    },
    {
      deleted: true,
    },
  );
  res.redirect(req.get("Referer"));
};
