const mongoose = require("mongoose");
const { URI_DATABASE } = require("../config/uri_database");

mongoose.connect(process.env.DB_HOST || URI_DATABASE, {
  useNewUrlParser: true,
});
const Schema = mongoose.Schema;
const AdminSchema = new Schema(
  {
    username: String,
    password: String,
    name: String,
  },
  { collection: "admin" }
);

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
