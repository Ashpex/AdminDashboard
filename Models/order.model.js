const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(URI_DATABASE, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    purchasedDate: Date,
  },
  { collection: "order" }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
