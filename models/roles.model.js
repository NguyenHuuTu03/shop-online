const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: [],
    },
    status: String,
    deleted: {
      type: Boolean,
      default: false, // để mỗi khi thêm sản phẩm vào DB mà không có trường deleted thì nó mặc định là false
    },
    deletedAt: Date,
  },
  {
    timestamps: true, // thêm vào để tạo thêm trường createAt và updateAt trong DB
  },
);

const Role = mongoose.model("Role", roleSchema, "roles"); //- tạo model (cú pháp gồm (tên model, Schema, tên collection trong DB))
module.exports = Role;
