const express = require("express");
const router = express.Router();
const to_slug = require("../public/js/slug.js");

const Category = require("../Models/category.model");
const Product = require("../Models/product.model");

// show list category and product in this category
router.get("/list-category", async (req, res) => {
  const categories = await Category.find();
  const listProducts = [];

  for (let i = 0; i < categories.length; i++) {
    const product = await Product.find({
      _id: { $in: categories[i].listIdProduct },
    });

    listProducts.push(product);
  }

  res.render("category/list-category", {
    categories,
    products: listProducts,
    length: listProducts.length,
  });
});

// edit category
router.get("/edit-category/:id", (req, res) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) {
      console.log(err);
    } else {
      res.render("category/edit-category", {
        category,
      });
    }
  });
});

// edit category post
router.post("/edit-category", (req, res) => {
  Category.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.name,
      idCategory: to_slug(req.body.name) + "-" + Date.now(),
    },
    (err, category) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/category/list-category");
      }
    }
  );
});

// delete category and product in this category
router.get("/delete-category/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  const listIdProduct = category.listIdProduct;

  for (let i = 0; i < listIdProduct.length; i++) {
    await Product.findByIdAndDelete(listIdProduct[i]);
  }

  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/category/list-category");
});

// add category
router.get("/add-category", (req, res) => {
  res.render("category/add-category");
});

// add category post
router.post("/add-category", (req, res) => {
  const category = new Category({
    name: req.body.name,
    idCategory: to_slug(req.body.name) + "-" + Date.now(),
    listIdProduct: [],
  });

  category.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/category/list-category");
    }
  });
});

module.exports = router;
