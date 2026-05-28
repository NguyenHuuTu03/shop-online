const mongoose = require("mongoose");

const forgotSchema = mongoose.Schema({
  email: String,
  otp: String,
  expireAt: {
    type: Date,
    expires: 0,
  },
});
const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotSchema,
  "forgot-password",
);
module.exports = ForgotPassword;
