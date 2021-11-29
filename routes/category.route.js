const express = require("express");
const router = express.Router();

const Category = require("../models/category.model");
const Product = require("../models/product.model");
const { route } = require("./product.route");

// // show list category
// router.get("/list-category", async (req, res) => {
//   const categories = await Category.find();
//   res.render("category/list-category", {
//     categories,
//   });
// });

// show list category and product in this category
router.get("/list-category", async (req, res) => {
  const categories = await Category.find();
  res.render("category/list-category", {
    categories,
  });
});

router.get("/add-category", (req, res) => {
  res.render("category/add-category");
});

router.post("/add-category", (req, res) => {
  const formData = req.body;
  formData.listIdProduct = [];
  const category = new Category(formData);
  category.save().then(() => res.redirect("/category/list-category"));
});

router.get("/edit-category/:id", (req, res) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) return next(err);
    res.render("category/edit-category", {
      category,
    });
  });
});

router.put("/edit-category/:id", (req, res) => {
  Category.updateOne({ _id: req.params.id }, { name: req.body.name }).then(() =>
    res.redirect("/category/list-category")
  );
});

// [Delete ms dung]
router.get("/delete-category/:id", async (req, res) => {
  const categoryDel = await Category.findById(req.params.id);
  //res.json(categoryDel);
  const listIdProductDel = categoryDel.listIdProduct;

  for (const idProduct of listIdProductDel) {
    await Product.findByIdAndDelete(idProduct);
  }
  //res.json(listIdProductDel);

  Category.findByIdAndDelete(req.params.id, (err, category) => {
    if (err) return next(err);
    res.redirect("/category/list-category");
  });
});

module.exports = router;
