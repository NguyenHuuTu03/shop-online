const Order = require("../../models/order.model");
const User = require("../../models/users.model");
const Products = require("../../models/product.model");

const converToSlugHelpers = require("../../helpers/convertToSlug");
const searchHelpers = require("../../helpers/search");
const filterHelpers = require("../../helpers/filter");
const paginationHelpers = require("../../helpers/pagination");
const caculaterHelpers = require("../../helpers/caculater");

// [GET] /admin/deliver
module.exports.index = async (req, res) => {
  let find = {
    status: "CONFIRMED",
    shipStatus: "PENDING",
    shipperId: "",
  };

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

  res.render("admin/pages/shiper/index", {
    pageTitle: "Nhận đơn hàng",
    orders: orders,
    totalPage: objectPagination.totalPage,
    currentPage: objectPagination.currentPage,
  });
};

// [GET] /admin/deliver/list
module.exports.list = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const shiper = await User.findOne({
    tokenUser: tokenUser,
  });
  let find = {
    shipperId: shiper.id,
  };

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

  res.render("admin/pages/shiper/list", {
    pageTitle: "Danh sách đơn hàng đã nhận",
    orders: orders,
    totalPage: objectPagination.totalPage,
    currentPage: objectPagination.currentPage,
  });
};

// [GET] /admin/deliver/detail/:orderId
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

  res.render("admin/pages/shiper/detail", {
    pageTitle: "Chi tiết đơn hàng",
    order: order,
  });
};

// [PATCH] /admin/deliver/ship
module.exports.ship = async (req, res) => {
  const orderId = req.body.orderId;
  const tokenUser = req.cookies.tokenUser;
  const shiper = await User.findOne({
    deleted: false,
    tokenUser: tokenUser,
  }).select("-password");
  await Order.updateOne(
    {
      _id: orderId,
    },
    {
      shipperId: shiper.id,
    },
  );
  res.json({
    code: 200,
    message: "Thành công!",
  });
};

// [PATCH] /admin/deliver/change-payment-status
module.exports.changePaymentStatus = async (req, res) => {
  const orderId = req.body.orderId;
  const paymentStatus = req.body.paymentStatus;
  const order = await Order.findOne({
    _id: orderId,
  });
  if (order.status == "COMPLETED") {
    await Order.updateOne(
      {
        _id: orderId,
      },
      {
        paymentStatus: paymentStatus,
      },
    );
  }
  const newOrder = await Order.findOne({
    _id: orderId,
  });
  res.json({
    code: 200,
    message: "Thành công!",
    orderStatus: newOrder.status,
  });
};
