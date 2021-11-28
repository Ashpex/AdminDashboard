const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(URI_DATABASE, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    name: String,
    listIdProduct: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { collection: "category" }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
