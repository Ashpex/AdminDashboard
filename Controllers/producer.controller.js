const Producer = require("../Models/producer.model");
const Product = require("../Models/product.model");

module.exports = {
  showListProducer: async (req, res) => {
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
  },
  editProducerGet: (req, res) => {
    Producer.findById(req.params.id, (err, producer) => {
      if (err) {
        console.log(err);
      } else {
        res.render("producer/edit-producer", {
          producer,
        });
      }
    });
  },
  editProducerPost: (req, res) => {
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
  },
  deleteProducer: async (req, res) => {
    const producer = await Producer.findById(req.params.id);
    const listIdProduct = producer.listIdProduct;

    for (let i = 0; i < listIdProduct.length; i++) {
      await Product.findByIdAndDelete(listIdProduct[i]);
    }

    await Producer.findByIdAndDelete(req.params.id);
    res.redirect("/producer/list-producer");
  },
  addProducerPost: async (req, res) => {
    const producer = new Producer({
      name: req.body.name,
      listIdProduct: [],
    });
    await producer.save();
    res.redirect("/producer/list-producer");
  },
};
