const Category = require("../../models/category.model");
const Products = require("../../models/product.model");
module.exports.index = async (req, res) => {
  const categories = await Category.findOne({
    deleted: false,
  });
  const products = await Products.find({
    deleted: false,
    status: "active",
    featured: true,
  });
  for (const item of products) {
    item.priceNew = parseInt(
      Math.round(item.price * (1 - item.discount / 100)).toFixed(0),
    );
  }
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    categories: categories,
    products: products,
  });
};
