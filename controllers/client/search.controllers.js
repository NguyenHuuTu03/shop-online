const convertHelpers = require("../../helpers/convertToSlug");
const Products = require("../../models/product.model");
const caculaterHelpers = require("../../helpers/caculater");
const Category = require("../../models/category.model");
const Brand = require("../../models/brand.model");
const filterHelpers = require("../../helpers/filter");

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  if (keyword) {
    const stringRegex = new RegExp(keyword, "i");
    const stringSlug = convertHelpers.convertToSlug(keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i");
    let products = await Products.find({
      deleted: false,
      $or: [
        {
          title: stringRegex,
        },
        {
          slug: stringSlugRegex,
        },
      ],
    }).lean();
    for (const product of products) {
      caculaterHelpers.caculaterPriceNew(product);
      const categoryChildren = await Category.findOne({
        deleted: false,
        _id: product.categoryId,
      }).select("title parentId");
      const categoryParent = await Category.findOne({
        deleted: false,
        _id: categoryChildren.parentId,
      }).select("title slug");
      product.category = categoryParent?.title;
    }

    // filterHelpers
    const newProducts = filterHelpers.filter(req.query, products);
    // end filterHelpers

    const brandsId = products.map((product) => product.brandId);
    const brands = await Brand.find({
      deleted: false,
      _id: { $in: brandsId },
    });
    const type = req.params.type;
    switch (type) {
      case "result":
        res.render("client/pages/search/result", {
          pageTitle: "Kết quả tìm kiếm",
          products: newProducts,
          brands: brands,
          query: req.query,
          keyword: req.query.keyword,
        });
        break;
      case "suggest":
        res.json({
          code: 200,
          message: "Thành công!",
          products: products,
        });
        break;
      default:
        break;
    }
  }
};
