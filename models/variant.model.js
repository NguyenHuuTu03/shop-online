const mongoose = require("mongoose");
const variantSchema = new mongoose.Schema({
  productId: String,
  color: String,
  ram: String,
  storage: String,
  price: Number,
  stock: Number,
  image: String,
  status: {
    type: String,
    default: "active",
  },
});

const Variant = mongoose.model("Variant", variantSchema, "variants");
module.exports = Variant;
