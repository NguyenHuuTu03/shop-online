const Order = require("../../models/order.model");
const Role = require("../../models/roles.model");
const User = require("../../models/users.model");
const Products = require("../../models/product.model");

const systemConfig = require("../../config/system");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
  }).select("-password");
  const role = await Role.findOne({
    _id: user.roleId,
  });

  if (!role.permissions.includes("dashboard_view")) {
    const page = role.permissions[0].split("_")[0];
    res.redirect(`${systemConfig.prefixAdmin.path}/${page}`);
    return;
  } else {
    const totalOrder = await Order.countDocuments({
      status: { $ne: "CANCELED" },
    });
    const orders = await Order.find({
      status: { $nin: ["CANCELED", "REFUND"] },
    });
    const totalRevenue = orders.reduce((sum, item) => sum + item.totalPrice, 0);

    const totalProducts = await Products.countDocuments({
      deleted: false,
      status: "active",
    });

    const role = await Role.findOne({
      title: "User",
    });
    const totalUsers = await User.countDocuments({
      deleted: false,
      status: "active",
      roleId: role.id,
    });

    const listOrder = await Order.find({
      status: { $ne: "CANCELED" },
    })
      .sort({ createdAt: -1 })
      .limit(3);
    res.render("admin/pages/dashboard/index", {
      pageTitle: "Tổng quan",
      totalOrder: totalOrder,
      totalRevenue: totalRevenue,
      totalProducts: totalProducts,
      totalUsers: totalUsers,
      listOrder: listOrder,
    });
  }
};
