const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

mongoose.connect(URI_DATABASE, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    name: String,
    listIdProduct: [{ type: mongoose.Schema.Types.ObjectId }],
    idCategory: { type: String, slug: "name", unique: true },
  },
  { collection: "category" }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
