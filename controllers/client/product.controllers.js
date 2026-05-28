const Products = require("../../models/product.model");
const Category = require("../../models/category.model");
const Brand = require("../../models/brand.model");
const caculaterHelpers = require("../../helpers/caculater");
const filterHelpers = require("../../helpers/filter");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Products.find({
    deleted: false,
  });
  for (const product of products) {
    caculaterHelpers.caculaterPriceNew(product);
  }
  const categories = await Category.find({
    deleted: false,
    parentId: null,
  });
  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    categories: categories,
  });
};

// [GET] /products/:slugCategory
module.exports.productCategory = async (req, res) => {
  const slugCategory = req.params.slugCategory;
  const categoryParent = await Category.findOne({
    deleted: false,
    slug: slugCategory,
  });
  const categoryChildren = await Category.find({
    deleted: false,
    parentId: categoryParent.id,
  }).select("title");
  let listProducts = [];
  for (const category of categoryChildren) {
    const products = await Products.find({
      deleted: false,
      categoryId: category.id,
    });
    listProducts.push(...products);
  }

  for (const product of listProducts) {
    caculaterHelpers.caculaterPriceNew(product);
  }

  const brandsId = listProducts.map((product) => product.brandId);
  const brands = await Brand.find({
    deleted: false,
    _id: { $in: brandsId },
  });

  // filterHelpers
  const newProducts = filterHelpers.filter(req.query, listProducts);
  // end filterHelpers

  res.render("client/pages/products/product-category", {
    pageTitle: "Product Category",
    products: newProducts,
    brands: brands,
    slugCategory: slugCategory,
    query: req.query,
  });
};

// [GET] /products/detail/:slugProduct
module.exports.productDetail = async (req, res) => {
  const slugProduct = req.params.slugProduct;
  const product = await Products.findOne({
    deleted: false,
    slug: slugProduct,
  });
  caculaterHelpers.caculaterPriceNew(product);
  const categoryChildren = await Category.findOne({
    deleted: false,
    _id: product.categoryId,
  }).select("title parentId");
  const categoryParent = await Category.findOne({
    deleted: false,
    _id: categoryChildren.parentId,
  }).select("title slug");
  product.category = categoryParent;
  const brand = await Brand.findOne({
    deleted: false,
    _id: product.brandId,
  }).select("title");
  product.brand = brand;
  res.render("client/pages/products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product: product,
  });
};
