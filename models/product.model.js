const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = mongoose.Schema(
  {
    title: String,
    images: {
      type: Array,
      default: [],
    },
    slug: { type: String, slug: "title", unique: true },
    description: String,
    categoryId: String,
    brandId: String,
    price: Number,
    discount: Number,
    thumbnail: String,
    featured: Boolean,
    status: String,
    position: Number,
    specifications: {
      screen: String,
      cpu: String,
      ram: String,
      storage: String,
      gpu: String,
      battery: String,
      camera: String,
      os: String,
      weight: String,
    },
    variants: [
      {
        color: String,
        ram: String,
        storage: String,
        price: Number,
        stock: Number,
        image: String,
      },
    ],
    tags: {
      type: Array,
      default: [],
    },
    warranty: String,
    shippingInfo: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    deletedBy: String,
    createdBy: String,
    updatedBy: String,
  },

  {
    timestamps: true,
  },
);
const Products = mongoose.model("Products", productSchema, "products");
module.exports = Products;
