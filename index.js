const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const databaseService = require("./services/database.service");
const helpers = require("./helpers/viewEngine.js");
const env = require("dotenv").config();

const AdminRoute = require("./routes/admin.route");
const AccountRoute = require("./routes/account.route");
const ProductRoute = require("./routes/product.route");
const CategoryRoute = require("./routes/category.route");
const ProducerRoute = require("./routes/producer.route");
const RevenueRouter = require("./routes/revenue.route");
const SessionMiddleware = require("./middlewares/session");
const PassportMiddleware = require("./middlewares/passport");
const LocalsMiddleware = require("./middlewares/locals");
const AuthMiddleware = require("./middlewares/auth");

databaseService.connectDatabase();

const app = express();

app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: helpers,
  })
);
app.set("view engine", "hbs");

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));

SessionMiddleware(app);
PassportMiddleware(app);
app.use(LocalsMiddleware);

// app.use("/admin", AdminRoute);

// app.use((req, res, next) => {
//   if (!req.user) {
//     // res.redirect("/admin/login");
//     return res.render("admin/login", {
//       layout: false,
//     });
//   } else {
//     next();
//   }
// });

app.get("/", AuthMiddleware, function (req, res) {
  res.render("home");
});

app.use("/admin", AdminRoute);
app.use("/account", AuthMiddleware, AccountRoute);
app.use("/product", AuthMiddleware, ProductRoute);
app.use("/category", AuthMiddleware, CategoryRoute);
app.use("/producer", AuthMiddleware, ProducerRoute);
app.use("/revenue", AuthMiddleware, RevenueRouter);

app.use((req, res) => {
  res.render("errors/404", { layout: false });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).render("errors/500", { layout: false, error: err.message });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App listening on port 3000");
});
