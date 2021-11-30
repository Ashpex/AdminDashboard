const express = require("express");
const User = require("../Models/user.model");

const router = express.Router();

router.get("/list-account/", (req, res) => {
  User.find({}, (err, account) => {
    if (err) return next(err);
    res.render("account/list-account", {
      account,
    });
  });
});

// add account
router.get("/add-account", (req, res) => {
  res.render("account/add-account");
});

// add account post
router.post("/add-account", (req, res) => {
  const { name, email, password, address } = req.body;
  const newUser = new User({
    name,
    email,
    password,
    address,
    status: true,
  });
  newUser.save((err) => {
    if (err) return next(err);
    res.redirect("/account/list-account");
  });
});

// edit account
router.get("/edit-account/:id", (req, res) => {
  User.findById(req.params.id, (err, account) => {
    if (err) return next(err);
    res.render("account/edit-account", {
      account,
    });
  });
});

// edit account post
router.post("/edit-account", (req, res) => {
  User.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.phone,
        address: req.body.address,
      },
    },
    (err, account) => {
      if (err) return next(err);
      res.redirect("/account/list-account");
    }
  );
});

// block account
router.get("/block-account/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        status: false,
      },
    },
    (err, account) => {
      if (err) return next(err);
      res.redirect("/account/list-account");
    }
  );
});

// unblock account
router.get("/unblock-account/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        status: true,
      },
    },
    (err, account) => {
      if (err) return next(err);
      res.redirect("/account/list-account");
    }
  );
});

// delete account
router.get("/delete-account/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, account) => {
    if (err) return next(err);
    res.redirect("/account/list-account");
  });
});

module.exports = router;
