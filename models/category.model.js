const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
  {
    title: String,

    slug: {
      type: String,
      slug: "title",
      unique: true,
    },

    description: String,

    thumbnail: String,

    parentId: String,

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

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
