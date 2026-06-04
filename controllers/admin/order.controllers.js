const Order = require("../../models/order.model");
const Products = require("../../models/product.model");

const converToSlugHelpers = require("../../helpers/convertToSlug");
const searchHelpers = require("../../helpers/search");
const filterHelpers = require("../../helpers/filter");
const paginationHelpers = require("../../helpers/pagination");
const caculaterHelpers = require("../../helpers/caculater");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  let find = {};

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

  const countOrder = await Order.countDocuments(find);

  // PAGINATION
  objectPagination = await paginationHelpers.pagination(
    objectPagination,
    req.query,
  );

  objectPagination.totalPage = Math.ceil(
    countOrder / objectPagination.limitItem,
  );

  const orders = await Order.find(find)
    .sort(objectFilter.sort)
    .limit(objectFilter.limit)
    .skip(objectPagination.skip);

  res.render("admin/pages/orders/index", {
    pageTitle: "Quản lý danh mục sản phẩm",
    orders: orders,
    totalPage: objectPagination.totalPage,
    currentPage: objectPagination.currentPage,
  });
};

// [GET] /admin/orders/detail/:orderId
module.exports.detail = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({
    _id: orderId,
  });
  for (const item of order.products) {
    const productInfo = await Products.findOne({
      _id: item.productId,
    }).select("title thumbnail");
    item.productInfo = productInfo;
    item.priceNew = Math.round(item.price * (1 - item.discount / 100));
    item.totalPrice = item.quantity * item.priceNew;
  }

  res.render("admin/pages/orders/detail", {
    pageTitle: "Chi tiết đơn hàng",
    order: order,
  });
};

// [GET] /admin/orders/edit/:orderId
module.exports.edit = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({
    _id: orderId,
  });
  for (const item of order.products) {
    const productInfo = await Products.findOne({
      _id: item.productId,
    }).select("title thumbnail");
    item.productInfo = productInfo;
    item.priceNew = Math.round(item.price * (1 - item.discount / 100));
    item.totalPrice = item.quantity * item.priceNew;
  }
  res.render("admin/pages/orders/edit", {
    pageTitle: "Cập nhật đơn hàng",
    order: order,
  });
};

// [PATCH] /admin/orders/edit/status/orderId
module.exports.editStatus = async (req, res) => {
  const orderId = req.body.orderId;
  const status = req.body.status;
  await Order.updateOne(
    {
      _id: orderId,
    },
    {
      status: status,
    },
  );
  res.json({
    code: 200,
    message: "Thành công!",
  });
};
