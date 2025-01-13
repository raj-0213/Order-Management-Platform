// module.exports = (sequelize, Sequelize) => {
//   return {
//     User: require("./User")(sequelize, Sequelize),
//     Product: require("./Product")(sequelize, Sequelize),
//     Order: require("./Order")(sequelize, Sequelize),
//     OrderDetails: require("./OrderDetails")(sequelize, Sequelize),  
//     Category: require("./Category")(sequelize, Sequelize),
//     Cart: require("./Cart")(sequelize, Sequelize),  
//   };
// };


const { Sequelize  } = require('sequelize');
const sequelize = require('../database/config'); // Ensure correct path to your Sequelize instance

const User = require('./User')(sequelize, Sequelize);
const Product = require('./Product')(sequelize, Sequelize);
const Order = require('./Order')(sequelize, Sequelize);
const OrderDetails = require('./OrderDetails')(sequelize, Sequelize);
const Category = require('./Category')(sequelize, Sequelize);
const Cart = require('./Cart')(sequelize, Sequelize);

// Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderDetails, { foreignKey: 'orderId' });
OrderDetails.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderDetails, { foreignKey: 'productId' });
OrderDetails.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

// Export all models and the sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  Order,
  OrderDetails,
  Category,
  Cart,
};
