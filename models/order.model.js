const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: String,
    fullName: String,
    phone: String,
    email: String,
    address: String,
    paymentMethod: String,
    paymentStatus: String,
    shipperId: {
      type: String,
      default: "",
    },
    shipStatus: {
      type: String,
      default: "PENDING",
    },
    status: {
      type: String,
      default: "PENDING",
    },
    products: Array,
    totalPrice: Number,
  },
  {
    timestamps: true,
  },
);
const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;
