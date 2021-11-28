const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(URI_DATABASE, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const ShoppingCartSchema = new Schema(
  {
    listIdProduct: [{ type: Schema.Types.ObjectId }],
    idOrder: { type: Schema.Types.ObjectId },
  },
  { collection: "shoping_cart" }
);

const ShoppingCart = mongoose.model("ShoppingCart", ShoppingCartSchema);
module.exports = ShoppingCart;
