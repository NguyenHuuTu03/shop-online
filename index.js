const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const clientRoutes = require("./routes/client/index.router");
const adminRoutes = require("./routes/admin/index.router");
const database = require("./config/database");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const axios = require("axios");
const moment = require("moment");
const systemConfig = require("./config/system");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(methodOverride("_method"));

app.use(cookieParser("key tự tạo để bảo mật"));
app.use(
  session({
    cookie: {
      maxAge: 60000, // thời gian cho cookie
    },
  }),
);
app.use(flash());

database();

app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce")),
);

app.locals.moment = moment;
app.locals.prefixAdmin = systemConfig.prefixAdmin.path;

clientRoutes(app);
adminRoutes(app);

app.use((req, res) => {
  res.status(404).render("admin/pages/errors/404", {
    pageTitle: "Trang 404",
  });
});

app.listen(port, () => {
  console.log(`Hãy truy cập link:http://localhost:${port}/products`);
});
