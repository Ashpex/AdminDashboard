const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../Models/product.model");
const Category = require("../Models/category.model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log(file);
    if (
      file.mimetype == "image/bmp" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only image are allowed!"));
    }
  },
}).single("image");

// show list product
router.get("/list-product", (req, res) => {
  Product.find({}, (err, product) => {
    if (err) return next(err);
    res.render("product/list-product", {
      product,
    });
  });
});

// add product
router.get("/add-product", (req, res) => {
  Category.find({}, (err, category) => {
    if (err) return next(err);
    res.render("product/add-product", {
      category,
    });
  });
});

//add product post and add product id to category
router.post("/add-product", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      Category.find({}, (err, category) => {
        if (err) return next(err);
        res.render("product/add-product", {
          category,
          msg: err,
        });
      });
    } else {
      if (!req.file) {
        Category.find({}, (err, category) => {
          if (err) return next(err);
          res.render("product/add-product", {
            category,
            msg: "Vui lòng chọn ảnh sản phẩm",
          });
        });
      } else {
        const product = new Product({
          name: req.body.name,
          price: req.body.price,
          image: req.body.urlImage,
          details: req.body.details,
          category: req.body.category,
        });

        product.save((err) => {
          if (err) {
            console.log(err);
            res.render("product/add-product", {
              msg: err,
            });
          } else {
            // find category and push product id
            Category.findByIdAndUpdate(
              req.body.id_category,
              {
                $push: {
                  listIdProduct: product._id,
                },
              },
              (err, cha) => {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect("/product/list-product");
                }
              }
            );
          }
        });
      }
    }
  });
});

// edit product
router.get("/edit-product/:id", (req, res) => {
  // find all category
  Category.find({}, (err, category) => {
    if (err) return next(err);
    Product.findById(req.params.id, (err, product) => {
      if (err) return next(err);
      res.render("product/edit-product", {
        product,
        category,
      });
    });
  });
});

// edit product post
router.post("/edit-product", (req, res) => {
  // find category and add product to category
  // Category.Cha.findByIdAndUpdate(req.body.id_category, (err, category) => {
  //   if (err) return next(err);
  //   category.listIdProduct.push(req.body.id);
  //   category.save();
  // });

  Category.find({}, (err, category) => {
    if (err) return next(err);
    res.render("product/add-product", {
      category,
      msg: err,
    });
  });

  // find product and update
  Product.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        details: req.body.details,
      },
    },
    (err, product) => {
      if (err) return next(err);
      res.redirect("/product/list-product");
    }
  );
});

// delete product
router.get("/delete-product/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, product) => {
    if (err) return next(err);
    res.redirect("/product/list-product");
  });
});

module.exports = router;
