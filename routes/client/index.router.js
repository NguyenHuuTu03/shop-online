const homeRoutes = require("./home.router");
const productRoutes = require("./product.router");
const searchRoutes = require("./search.router");
const userRoutes = require("./user.router");
const cartRoutes = require("./cart.router");
const orderRoutes = require("./order.router");
const paymentRoutes = require("./payment.router");
const userMiddleware = require("../../middleware/client/user.middleware");

const generalMiddleware = require("../../middleware/public/general.middleware");

module.exports = (app) => {
  app.use(userMiddleware.infoUser);
  app.use(generalMiddleware.general);

  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/users", userRoutes);
  app.use("/cart", cartRoutes);
  app.use("/order", orderRoutes);
  app.use("/payment", paymentRoutes);
};
