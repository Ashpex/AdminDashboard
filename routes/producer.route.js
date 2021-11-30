const express = require("express");
const router = express.Router();

const Producer = require("../Models/producer.model");
const Product = require("../Models/product.model");

// show list of producers
router.get("/list-producer", async (req, res) => {
  const producers = await Producer.find();
  const listProducts = [];

  for (let i = 0; i < producers.length; i++) {
    const product = await Product.find({
      _id: { $in: producers[i].listIdProduct },
    });

    listProducts.push(product);
  }

  res.render("producer/list-producer", {
    producers,
    products: listProducts,
    length: listProducts.length,
  });
});

// edit producer
router.get("/edit-producer/:id", (req, res) => {
  Producer.findById(req.params.id, (err, producer) => {
    if (err) {
      console.log(err);
    } else {
      res.render("producer/edit-producer", {
        producer,
      });
    }
  });
});

// edit producer post
router.post("/edit-producer", (req, res) => {
  Producer.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.name,
    },
    (err, category) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/producer/list-producer");
      }
    }
  );
});

// delete producer and product in this producer
router.get("/delete-producer/:id", async (req, res) => {
  const producer = await Producer.findById(req.params.id);
  const listIdProduct = producer.listIdProduct;

  for (let i = 0; i < listIdProduct.length; i++) {
    await Product.findByIdAndDelete(listIdProduct[i]);
  }

  await Producer.findByIdAndDelete(req.params.id);
  res.redirect("/producer/list-producer");
});

// add new producer
router.get("/add-producer", (req, res) => {
  res.render("producer/add-producer");
});

// post new producer
router.post("/add-producer", async (req, res) => {
  const producer = new Producer({
    name: req.body.name,
    listIdProduct: [],
  });
  await producer.save();
  res.redirect("/producer/list-producer");
});

module.exports = router;
