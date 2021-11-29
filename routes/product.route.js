const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const convertViToEn = require("../utils/convertViToEn");

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
  upload(req, res, async (err) => {
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
        //idProduct + listImgExtra
        const category = await Category.findById(req.body.id_category);
        // const random = await Math.floor(Math.random() * (1000 - 0 + 1) + 0);
        // const idProduct =
        //   (await convertViToEn.convertViToEn(req.body.name)) + "-" + random;

        const product = new Product({
          name: req.body.name,
          price: req.body.price,
          image: req.body.urlImage,
          details: req.body.details,
          category: category.name,
          quantity: req.body.quantity,
        });
        //res.send(product);
        //res.send(product);

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
router.post("/edit-product", async (req, res) => {
  // find category and add product to category
  // Category.Cha.findByIdAndUpdate(req.body.id_category, (err, category) => {
  //   if (err) return next(err);
  //   category.listIdProduct.push(req.body.id);
  //   category.save();
  // });

  Category.find({}, (err, category) => {
    if (err) {
      return next(err);
      // res.render("product/add-product", {
      //   category,
      //   msg: err,
      // });
    }
  });

  const productEdit = await Product.findById(req.body.id);
  //res.send(productEdit);
  const categoryRemove = await Category.findOne({ name: productEdit.category });
  await categoryRemove.listIdProduct.remove(productEdit.id);
  await Category.findByIdAndUpdate(categoryRemove.id, {
    $set: {
      listIdProduct: categoryRemove.listIdProduct,
    },
  });

  const categoryAdd = await Category.findById(req.body.id_category);
  await categoryAdd.listIdProduct.push(productEdit.id);
  await Category.findByIdAndUpdate(categoryAdd.id, {
    $set: {
      listIdProduct: categoryAdd.listIdProduct,
    },
  });

  // find product and update
  Product.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        name: req.body.name,
        price: req.body.price,
        category: categoryAdd.name,
        details: req.body.details,
        quantity: req.body.quantity,
      },
    },
    (err, product) => {
      if (err) return next(err);
      res.redirect("/product/list-product");
    }
  );
});

// delete product
router.get("/delete-product/:id", async (req, res) => {
  const productDel = await Product.findById(req.params.id);

  const category = await Category.findOne({ name: productDel.category });
  await category.listIdProduct.remove(productDel.id);

  await Category.findByIdAndUpdate(category.id, {
    $set: {
      listIdProduct: category.listIdProduct,
    },
  });

  Product.findByIdAndDelete(req.params.id, (err, product) => {
    if (err) return next(err);
    res.redirect("/product/list-product");
  });
});

module.exports = router;
