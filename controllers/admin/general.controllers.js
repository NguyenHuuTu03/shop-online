const Setting = require("../../models/setting.model");
// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const setting = await Setting.findOne({
    deleted: false,
  });
  let general = {};
  if (setting) {
    general = setting;
  }
  res.render("admin/pages/general/index", {
    pageTitle: "Cài đặt chung",
    general: general,
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPost = async (req, res) => {
  if (req.body.logo) {
    req.body.logo = req.body.logo[0];
  }
  await Setting.updateOne(
    {
      deleted: false,
    },
    req.body,
  );

  res.redirect(req.get("Referer"));
};
