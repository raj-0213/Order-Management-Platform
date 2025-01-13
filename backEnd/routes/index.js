const express = require("express");

module.exports = {
  productRoutes: require("./product.routes"),
  orderRoutes: require("./order.routes"),
  cartRoutes: require("./cart.routes"),
  userRoutes: require("./user.routes"),
};
