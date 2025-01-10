module.exports = (sequelize, Sequelize) => {
  return {
    User: require("./User")(sequelize, Sequelize),
    Product: require("./Product")(sequelize, Sequelize),
    Order: require("./Order")(sequelize, Sequelize),
    OrderDetails: require("./OrderDetails")(sequelize, Sequelize),  
    Category: require("./Category")(sequelize, Sequelize),
    Cart: require("./Cart")(sequelize, Sequelize),  
  };
};
