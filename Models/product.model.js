const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

mongoose.connect(URI_DATABASE, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    name: String,
    details: String,
    quantity: Number,
    price: Number,
    image: String,
    category: String,
    listIdRating: [{ type: Schema.Types.ObjectId }],
    idProduct: { type: String, slug: "name", unique: true },
  },
  { collection: "product" }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
