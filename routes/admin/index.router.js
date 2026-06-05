const dashboardRoutes = require("./dashboard.router");
const systemConfig = require("../../config/system");
const productRoutes = require("./product.router");
const categoryRoutes = require("./category.router");
const userRoutes = require("./user.router");
const orderRoutes = require("./order.router");
const roleRoutes = require("./role.router");
const authRoutes = require("./auth.router");
const apiRoutes = require("./api.router");
const myAccountRoutes = require("./my-account.router");
const shipRoutes = require("./ship.router");
const authMiddleware = require("../../middleware/admin/auth.middleware");

module.exports = (app) => {
  const prefixAdmin = systemConfig.prefixAdmin.path;
  app.use(
    prefixAdmin + "/dashboard",
    authMiddleware.authRequest,
    dashboardRoutes,
  );
  app.use(prefixAdmin + "/products", authMiddleware.authRequest, productRoutes);
  app.use(
    prefixAdmin + "/categories",
    authMiddleware.authRequest,
    categoryRoutes,
  );
  app.use(prefixAdmin + "/users", authMiddleware.authRequest, userRoutes);
  app.use(prefixAdmin + "/orders", authMiddleware.authRequest, orderRoutes);
  app.use(prefixAdmin + "/roles", authMiddleware.authRequest, roleRoutes);
  app.use(prefixAdmin + "/auth", authRoutes);
  app.use(
    prefixAdmin + "/my-account",
    authMiddleware.authRequest,
    myAccountRoutes,
  );
  app.use(prefixAdmin + "/deliver", authMiddleware.authRequest, shipRoutes);
  app.use(prefixAdmin + "/api", apiRoutes);
};
