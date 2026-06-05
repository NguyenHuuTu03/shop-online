const User = require("../../models/users.model");
const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

module.exports.authRequest = async (req, res, next) => {
  if (!req.cookies.tokenAdmin) {
    res.redirect(`${systemConfig.prefixAdmin.path}/auth/login`);
    return;
  } else {
    const user = await User.findOne({
      deleted: false,
      status: "active",
      tokenAdmin: req.cookies.tokenAdmin,
    }).select("-password");
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin.path}/auth/login`);
      return;
    } else {
      res.locals.currentUser = user;
      if (user.roleId) {
        const role = await Role.findOne({
          deleted: false,
          _id: user.roleId,
        });
        res.locals.role = role;
      }
      next();
    }
  }
};
