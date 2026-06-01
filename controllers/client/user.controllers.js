const md5 = require("md5");
const User = require("../../models/users.model");
const Order = require("../../models/order.model");
const Products = require("../../models/product.model");
const generateHelpers = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password");
const sendHelpers = require("../../helpers/sendMail");

// [GET] /users/login
module.exports.login = async (req, res) => {
  res.render("client/pages/users/login", {
    pageTitle: "Đăng nhập",
  });
};

// [POST] /users/login
module.exports.loginPost = async (req, res) => {
  const exitsEmail = await User.findOne({
    deleted: false,
    email: req.body.email,
  });
  if (!exitsEmail) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (md5(req.body.password) != exitsEmail.password) {
    req.flash("error", "Mật khẩu không đúng!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (exitsEmail.status == "inactive") {
    req.flash("error", "Tài khoản không còn hoạt động!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (exitsEmail.deleted == true) {
    req.flash("error", "Tài khoản đã bị xoá!!");
    res.redirect(req.get("Referer"));
    return;
  }
  res.cookie("tokenUser", exitsEmail.tokenUser);
  res.redirect("/products");
};

// [GET] /users/register
module.exports.register = async (req, res) => {
  res.render("client/pages/users/register", {
    pageTitle: "Đăng ký",
  });
};

// [POST] /users/register
module.exports.registerPost = async (req, res) => {
  const exitsEmail = await User.findOne({
    deleted: false,
    email: req.body.email,
  });
  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    status: "active",
    tokenUser: generateHelpers.generateRandomString(30),
  });
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/products");
};

// [GET] /users/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/products");
};

// [GET] /users/profile
module.exports.profile = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const user = await User.findOne({
    deleted: false,
    tokenUser: tokenUser,
  }).select("-password");
  res.render("client/pages/users/profile", {
    pageTitle: "Thông tin cá nhân",
    user: user,
  });
};

// [POST] /users/profile
module.exports.profilePost = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    req.body,
  );

  res.redirect(req.get("Referer"));
};

// [GET] /users/forgot-password
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/users/forgot-password", {
    pageTitle: "Xác thực email",
  });
};

// [POST] /users/forgot-password
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    deleted: false,
    status: "active",
    email: email,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  const forgotPassword = new ForgotPassword({
    email: email,
    otp: generateHelpers.generateRandomNumber(6),
    expireAt: Date.now() + 1 * 60 * 1000,
  });
  await forgotPassword.save();
  const subject = "Xác nhận mã OTP";

  const html = `<p>Mã OTP của bạn là: <strong>${forgotPassword.otp}</strong>. Vui lòng không chia sẻ cho người khác.</p>`;
  sendHelpers.sendMail(email, subject, html);
  res.redirect("/users/otp-password");
};

// [GET] /user/otp-password
module.exports.otpPassword = (req, res) => {
  res.render("client/pages/users/otp-password", {
    pageTitle: "Xác thực OTP",
  });
};

// [POST] /user/otp-password
module.exports.otpPasswordPost = async (req, res) => {
  const otp = req.body.otp;
  const forgot = await ForgotPassword.findOne({
    otp: otp,
  });
  if (!forgot) {
    req.flash("error", "Mã OTP không đúng!");
    res.redirect(req.get("Referer"));
    return;
  }
  req.session.email = forgot.email;
  res.redirect("/users/reset-password");
};

// [GET] /user/reset-password
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/users/reset-password", {
    pageTitle: "Đặt lại mật khẩu",
  });
};

// [POST] /user/reset-password
module.exports.resetPasswordPost = async (req, res) => {
  const email = req.session.email;

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password !== confirmPassword) {
    req.flash("error", "Mật khẩu xác thực không khớp!");
    res.redirect(req.get("Referer"));
    return;
  }
  const user = await User.findOne({
    deleted: false,
    email: email,
  });
  if (user.password == md5(password)) {
    req.flash("error", "Mật khẩu mới không được trùng với mật khẩu cũ!");
    res.redirect(req.get("Referer"));
    return;
  }
  await User.updateOne({ email: email }, { password: md5(password) });
  delete req.session.email;
  res.redirect("/users/login");
};

// [GET] /users/orders
module.exports.order = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;

  const user = await User.findOne({
    deleted: false,
    tokenUser: tokenUser,
  }).select("-password");

  const orders = await Order.find({
    userId: user.id,
  });

  // xử lý gắn productInfo vào order.products
  for (const order of orders) {
    for (const item of order.products) {
      const productInfo = await Products.findOne({
        _id: item.productId,
      }).lean();

      if (productInfo) {
        productInfo.priceNew = Math.round(
          productInfo.price * (1 - productInfo.discount / 100),
        );

        item.productInfo = productInfo;
      }
    }
  }

  res.render("client/pages/users/order", {
    pageTitle: "Đơn hàng của tôi",
    orders: orders,
  });
};
