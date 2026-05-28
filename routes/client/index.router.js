const productRoutes = require("./product.router");
const searchRoutes = require("./search.router");
const userRoutes = require("./user.router");
const cartRoutes = require("./cart.router");
const userMiddleware = require("../../middleware/client/user.middleware");

module.exports = (app) => {
  app.use(userMiddleware.infoUser);

  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/users", userRoutes);
  app.use("/cart", cartRoutes);
};
