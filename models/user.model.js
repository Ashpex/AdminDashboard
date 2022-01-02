const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(process.env.DB_HOST || URI_DATABASE, {
  useNewUrlParser: true,
});
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    email: String,
    password: String,
    name: String,
    address: String,
    status: Boolean,
    idShoppingCart: { type: Schema.Types.ObjectId },
  },
  { collection: "user" }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
