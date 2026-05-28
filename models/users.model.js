const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    avatar: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    tokenUser: String,
    role: {
      type: String,
      default: "user",
    },
    deletedBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
