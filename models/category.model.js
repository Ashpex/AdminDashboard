const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(process.env.DB_HOST || URI_DATABASE, {
  useNewUrlParser: true,
});
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    name: String,
    idCategory: String,
    image: String,
    listIdProduct: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { collection: "category" }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
