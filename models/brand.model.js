const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const brandSchema = new mongoose.Schema(
  {
    title: String,

    slug: {
      type: String,
      slug: "title",
      unique: true,
    },

    description: String,

    logo: String,
    country: String,

    website: String,

    position: Number,

    status: String,

    deleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,

    createdBy: String,

    deletedBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
  },
);

const Brands = mongoose.model("Brands", brandSchema, "brands");

module.exports = Brands;
