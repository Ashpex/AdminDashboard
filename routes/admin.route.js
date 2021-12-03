const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

// var config = require("../config/");
const Admin = require("../models/admin.model");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/login", (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("admin/login", {
    layout: false,
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    },
    (err, admin, info) => {
      if (err) {
        return next(err);
      }

      if (!admin) {
        return res.render("admin/login", {
          layout: false,
          error: "Tài khoản hoặc mật khẩu không đúng",
        });
      }
      const retUrl = req.query.retUrl || "/";
      req.logIn(admin, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect(retUrl);
      });
    }
  )(req, res, next);
});

router.get("/logout", (req, res, next) => {
  res.status(200).clearCookie("connect.sid", {
    path: "/",
    secure: false,
    httpOnly: false,
    domain: "http://localhost:3000",
    sameSite: true,
  });
  req.logout();
  req.session.destroy(function (err) {
    res.redirect("/admin/login");
  });
});

router.get("/create-admin", (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  return res.render("admin/create-admin");
});

router.post("/create-admin", (req, res, next) => {
  const hash = bcrypt.hashSync(req.body.password, 10);

  const admin = new Admin({
    username: req.body.username,
    password: hash,
    name: req.body.name,
  });

  admin.save((err) => {
    if (err) return next(err);
    res.redirect("/admin/login");
  });
});

router.get("/profile/:id", auth, (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  return res.render("admin/profile", { id: req.params.id });
});

module.exports = router;
