const Setting = require("../../models/setting.model");
module.exports.general = async (req, res, next) => {
  const general = await Setting.findOne({
    deleted: false,
  });
  res.locals.general = general;
  next();
};
