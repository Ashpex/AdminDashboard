const express = require("express");
const OrdersController = require("../controllers/orders.controller");

const router = express.Router();

router.get("/", OrdersController.showListOrder);

module.exports = router;
