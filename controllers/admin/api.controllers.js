const Category = require("../../models/category.model");
const Products = require("../../models/product.model");
const Role = require("../../models/roles.model");
const User = require("../../models/users.model");

// [PATCH] /api/change-status
module.exports.changeStatus = async (req, res) => {
  const id = req.body.id;
  const status = req.body.status;
  const page = req.body.page;
  if (page == "product") {
    await Products.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      },
    );
  } else if (page == "category") {
    await Category.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      },
    );
  } else if (page == "user") {
    await User.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      },
    );
  } else if (page == "role") {
    await Role.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      },
    );
  }
  res.json({
    code: 200,
    message: "Thành công!",
  });
};
