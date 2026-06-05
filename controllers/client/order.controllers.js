const User = require("../../models/users.model");
const Cart = require("../../models/cart.model");
const Products = require("../../models/product.model");
const caculaterHelpers = require("../../helpers/caculater");
const Order = require("../../models/order.model");

module.exports.order = async (req, res) => {
  res.render("client/pages/order/index", {
    pageTitle: "Thanh toán",
  });
};

// [POST] /order/order-json
module.exports.orderJson = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  let dataCart = {};
  if (tokenUser) {
    const user = await User.findOne({
      deleted: false,
      tokenUser: tokenUser,
    }).select("-password");
    const cart = await Cart.findOne({
      userId: user.id,
    });
    dataCart = {
      products: cart.products,
    };
    for (const item of dataCart.products) {
      const productInfo = await Products.findOne({
        deleted: false,
        _id: item.id,
      }).lean();
      caculaterHelpers.caculaterPriceNew(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew;
    }
    dataCart.totalPrice = dataCart.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  } else {
    dataCart = {
      products: [...req.body],
    };
    for (const item of dataCart.products) {
      const productInfo = await Products.findOne({
        deleted: false,
        _id: item.id,
      });
      caculaterHelpers.caculaterPriceNew(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = productInfo.priceNew * item.quantity;
    }
    dataCart.totalPrice = dataCart.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  }

  res.json({
    code: 200,
    message: "Thành công!",
    dataCart: dataCart,
  });
};

// [POST] /order
module.exports.orderPost = async (req, res) => {
  const paymentMethod = req.body.paymentMethod;
  let dataOrder = {};
  const tokenUser = req.cookies.tokenUser;
  if (tokenUser) {
    const user = await User.findOne({
      deleted: false,
      tokenUser: tokenUser,
    }).select("-password");
    const cart = await Cart.findOne({
      userId: user.id,
    });
    let products = [];
    for (const item of cart.products) {
      const productInfo = await Products.findOne({
        deleted: false,
        _id: item.id,
      });
      caculaterHelpers.caculaterPriceNew(productInfo);
      item.totalPrice = productInfo.priceNew * item.quantity;
      const data = {
        productId: item.id,
        price: productInfo.price,
        discount: productInfo.discount,
        quantity: item.quantity,
      };
      products.push(data);
    }
    const totalPrice = cart.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    if (paymentMethod == "VNPay" || paymentMethod == "MoMo") {
      dataOrder = {
        userId: user.id,
        fullName: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        paymentMethod: paymentMethod,
        paymentStatus: "UNPAID",
        products: products,
        totalPrice: totalPrice,
      };
      const order = new Order(dataOrder);
      await order.save();

      return res.json({
        code: 200,
        orderId: order.id,
        totalPrice: totalPrice,
      });
    } else {
      dataOrder = {
        userId: user.id,
        fullName: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        paymentMethod: paymentMethod,
        paymentStatus: "UNPAID",
        products: products,
        totalPrice: totalPrice,
      };
      const order = new Order(dataOrder);
      await order.save();
      await Cart.updateOne(
        {
          _id: cart.id,
        },
        {
          products: [],
        },
      );
      return res.json({
        code: 200,
        orderId: order.id,
      });
    }
  } else {
    let products = [];
    for (const item of req.body.products) {
      const productInfo = await Products.findOne({
        deleted: false,
        _id: item.id,
      });
      caculaterHelpers.caculaterPriceNew(productInfo);
      item.totalPrice = productInfo.priceNew * item.quantity;
      const data = {
        productId: item.id,
        price: productInfo.price,
        discount: productInfo.discount,
        quantity: item.quantity,
      };
      products.push(data);
    }
    const totalPrice = req.body.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    if (paymentMethod == "VNPay" || paymentMethod == "MoMo") {
      dataOrder = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        paymentMethod: paymentMethod,
        paymentStatus: "UNPAID",
        products: products,
        totalPrice: totalPrice,
      };
      const order = new Order(dataOrder);
      await order.save();

      return res.json({
        code: 200,
        orderId: order.id,
        totalPrice: totalPrice,
      });
    } else {
      dataOrder = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        paymentMethod: paymentMethod,
        paymentStatus: "UNPAID",
        products: products,
        totalPrice: totalPrice,
      };
      const order = new Order(dataOrder);
      await order.save();

      return res.json({
        code: 200,
        orderId: order.id,
      });
    }
  }
};

// [GET] /order/success/:orderId
module.exports.orderSuccess = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({
    _id: orderId,
  });
  for (const item of order.products) {
    const productsInfo = await Products.findOne({
      deleted: false,
      _id: item.productId,
    }).select("title thumbnail");
    item.productInfo = productsInfo;
    item.priceNew = Math.round(item.price * (1 - item.discount / 100));
    item.totalPrice = item.priceNew * item.quantity;
  }
  res.render("client/pages/order/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};

// [PATCH] /order/delete/:orderId
module.exports.delete = async (req, res) => {
  const orderId = req.params.orderId;

  await Order.updateOne(
    {
      _id: orderId,
    },
    {
      status: req.body.status,
    },
  );
  res.json({
    code: 200,
    message: "Thành công!",
  });
};
