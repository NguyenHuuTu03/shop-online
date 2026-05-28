const User = require("../../models/users.model");

module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      deleted: false,
      tokenUser: req.cookies.tokenUser,
      status: "active",
    }).select("-password");
    if (user) {
      res.locals.user = user;
    }
  }
  next();
};
