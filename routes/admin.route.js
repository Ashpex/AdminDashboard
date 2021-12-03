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
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect("/admin/login");
  });
});

router.get("/add-admin", (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  return res.render("admin/add-admin");
});

router.post("/add-admin", (req, res, next) => {
  const hash = bcrypt.hashSync(req.body.password, 10);

  const admin = new Admin({
    username: req.body.username,
    password: hash,
    name: req.body.name,
  });

  admin.save((err) => {
    if (err) return next(err);
    res.redirect("/admin/list-admin/1");
  });
});

router.get("/profile", auth, async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  // find admin by id using await
  const admin = await Admin.findById(res.locals.authUser._id);
  return res.render("admin/profile", { id: res.locals.authUser._id, admin });
});

// edit profile
router.get("/edit-profile", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  // find admin by id using await
  const admin = await Admin.findById(res.locals.authUser._id);
  return res.render("admin/edit-profile", {
    id: res.locals.authUser._id,
    admin,
  });
});

// edit profile post
router.post("/edit-profile", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  const admin = await Admin.findById(req.body.id);
  admin.name = req.body.name;
  admin.username = req.body.username;
  await admin.save();
  return res.redirect("/admin/profile");
});

// change password
router.get("/change-password", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  return res.render("admin/change-password", {
    id: res.locals.authUser._id,
  });
});

// change password post
router.post("/change-password", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  const admin = await Admin.findById(req.body.id);
  const isMatch = bcrypt.compareSync(req.body.oldPassword, admin.password);
  if (!isMatch) {
    return res.render("admin/change-password", {
      id: res.locals.authUser._id,
      error: "Mật khẩu cũ không đúng",
    });
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.render("admin/change-password", {
      id: res.locals.authUser._id,
      error: "Mật khẩu mới không trùng khớp",
    });
  }
  const hash = bcrypt.hashSync(req.body.newPassword, 10);
  admin.password = hash;
  await admin.save();
  return res.redirect("/admin/profile");
});

// show all admin
router.get("/list-admin/:page", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin/login");
  }
  let perPage = 2; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;

  Admin.find() // find tất cả các data
    .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, admins) => {
      Admin.countDocuments((err, count) => {
        // đếm để tính có bao nhiêu trang
        if (err) return next(err);
        let isCurrentPage;
        const pages = [];
        for (let i = 1; i <= Math.ceil(count / perPage); i++) {
          if (i === +page) {
            isCurrentPage = true;
          } else {
            isCurrentPage = false;
          }
          pages.push({
            page: i,
            isCurrentPage: isCurrentPage,
          });
        }
        res.render("admin/list-admin", {
          admins,
          pages,
          isNextPage: page < Math.ceil(count / perPage),
          isPreviousPage: page > 1,
          nextPage: +page + 1,
          previousPage: +page - 1,
        });
      });
    });
  // const admins = await Admin.find();
  // return res.render("admin/list-admin", { admins });
});

module.exports = router;
