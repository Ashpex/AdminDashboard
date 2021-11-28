const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(URI_DATABASE, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const RatingSchema = new Schema(
  {
    rating: Number,
    content: String,
  },
  { collection: "rating" }
);

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
