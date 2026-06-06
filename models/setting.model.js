const mongoose = require("mongoose");

const settingSchema = mongoose.Schema(
  {
    title: String,
    hotline: String,
    email: String,
    address: String,
    footer: String,
    logo: String,
    sideBar: Array,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Setting = mongoose.model("Setting", settingSchema, "settings");
module.exports = Setting;
