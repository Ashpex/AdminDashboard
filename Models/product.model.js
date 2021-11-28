const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(URI_DATABASE, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    name: String,
    details: String,
    quanlity: String,
    price: Number,
    image: String,
    category: String,
    listIdRating: [{ type: Schema.Types.ObjectId }],
  },
  { collection: "product" }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
