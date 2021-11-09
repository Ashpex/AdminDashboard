const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

var app = express();

app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/charts", function (req, res) {
  res.render("charts");
});

app.get("/layout-sidenav-light", function (req, res) {
  res.render("layout-sidenav-light");
});

app.get("/layout-static", function (req, res) {
  res.render("layout-static");
});

app.get("/tables", function (req, res) {
  res.render("tables");
});
app.get("/login", function (req, res) {
  res.render("login", { layout: false });
});

app.get("/register", function (req, res) {
  res.render("register", { layout: false });
});
app.get("/password", function (req, res) {
  res.render("password", { layout: false });
});

app.get("/401", function (req, res) {
  res.render("401", { layout: false });
});

app.get("/404", function (req, res) {
  res.render("404", { layout: false });
});

app.get("/500", function (req, res) {
  res.render("500", { layout: false });
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
