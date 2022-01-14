const mongoose = require("mongoose");
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
