const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: String,
    products: Array,
  },
  {
    timestamp: true,
  },
);
const Cart = mongoose.model("Cart", cartSchema, "carts");
module.exports = Cart;
