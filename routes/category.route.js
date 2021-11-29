const express = require("express");
const router = express.Router();

const Category = require("../models/category.model");
const Product = require("../models/product.model");

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
  const products = await Product.find();
  res.render("category/list-category", {
    categories,
    products,
  });
});

module.exports = router;
