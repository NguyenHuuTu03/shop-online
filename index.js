const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const clientRoutes = require("./routes/client/index.router");
const database = require("./config/database");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const axios = require("axios");
const moment = require("moment");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

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

app.locals.moment = moment;

clientRoutes(app);

app.listen(port, () => {
  console.log(`Hãy truy cập link:http://localhost:${port}/products`);
});
