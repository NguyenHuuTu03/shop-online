const Cart = require("../../models/cart.model");
const User = require("../../models/users.model");
const Products = require("../../models/product.model");
const caculaterHelpers = require("../../helpers/caculater");

// [GET] /cart
module.exports.index = async (req, res) => {
  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
  });
};

// [POST] /cart/cart-json
module.exports.cartJson = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  let cartNew = {};
  if (tokenUser) {
    const user = await User.findOne({
      deleted: false,
      tokenUser: tokenUser,
    }).select("-password");
    const cart = await Cart.findOne({
      userId: user.id,
    });
    if (cart) {
      let dataCart = [...cart.products];
      if (req.body.length > 0) {
        for (const item of req.body) {
          const index = dataCart.findIndex((product) => product.id == item.id);
          if (index != -1) {
            dataCart[index].quantity += item.quantity;
          } else {
            dataCart.push(item);
          }
        }
        await Cart.updateOne({ _id: cart.id }, { products: dataCart });
      }
    } else {
      const dataCart = new Cart({
        userId: user.id,
        products: req.body,
      });
      await dataCart.save();
    }
    cartNew = await Cart.findOne({
      userId: user.id,
    });
    for (const item of cartNew.products) {
      const productInfo = await Products.findOne({
        _id: item.id,
        deleted: false,
      }).lean();
      caculaterHelpers.caculaterPriceNew(productInfo);
      item.totalPrice = productInfo.priceNew * item.quantity;
      item.productInfo = productInfo;
    }
    cartNew.totalPrice = cartNew.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  } else {
    cartNew = {
      products: req.body,
    };
    for (const item of cartNew.products) {
      const productInfo = await Products.findOne({
        _id: item.id,
        deleted: false,
      }).lean();
      caculaterHelpers.caculaterPriceNew(productInfo);
      item.totalPrice = productInfo.priceNew * item.quantity;
      item.productInfo = productInfo;
    }
    cartNew.totalPrice = cartNew.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  }
  res.json({
    code: 200,
    message: "Thành công!",
    cart: cartNew,
  });
};

// [PATCH] /cart/update
module.exports.update = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  let dataCart = {};
  if (tokenUser) {
    const user = await User.findOne({
      tokenUser: tokenUser,
    });
    const cart = await Cart.findOne({
      userId: user.id,
    });
    const index = cart.products.findIndex(
      (item) => item.id == req.body.productId,
    );
    cart.products[index].quantity = req.body.quantity;
    await Cart.updateOne(
      {
        _id: cart.id,
      },
      {
        products: cart.products,
      },
    );
    const newCart = await Cart.findOne({
      userId: user.id,
    });
    for (const item of newCart.products) {
      const product = await Products.findOne({
        deleted: false,
        _id: item.id,
      });
      caculaterHelpers.caculaterPriceNew(product);
      item.totalPrice = item.quantity * product.priceNew;
    }
    newCart.totalPrice = newCart.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    dataCart = newCart;
  }
  res.json({
    code: 200,
    message: "Thành công!",
    dataCart: dataCart,
  });
};

// [Delete] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const productId = req.params.productId;
  const tokenUser = req.cookies.tokenUser;
  const user = await User.findOne({
    deleted: false,
    tokenUser: tokenUser,
  });
  const cart = await Cart.findOne({
    userId: user.id,
  });
  const productCart = cart.products.filter((item) => item.id != productId);
  await Cart.updateOne(
    {
      _id: cart.id,
    },
    {
      products: productCart,
    },
  );
  res.json({
    code: 200,
    message: "Thành công!",
  });
};

// [GET] /cart/mini-cart
module.exports.miniCart = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  let countQuantity = 0;
  if (tokenUser) {
    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false,
    });
    const cart = await Cart.findOne({
      userId: user.id,
    });
    countQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
  }
  res.json({
    code: 200,
    message: "Thành công!",
    quantity: countQuantity,
  });
};
