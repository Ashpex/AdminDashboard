const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(URI_DATABASE, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const ProducerSchema = new Schema(
  {
    name: String,
    listIdProduct: [{ type: Schema.Types.ObjectId }],
  },
  { collection: "producer" }
);

const Producer = mongoose.model("Producer", ProducerSchema);
module.exports = Producer;
