const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db.js');
const Product = require('./product.model');
const Order = require('./order.model.js');

const OrderProducts = sequelize.define('order_products',{
    orderId:{
        type : DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'orders',
            key: 'id'
        }
    },
    productId : {
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'products',
            key: 'id'
        }
    },
    quantity :{
        type:DataTypes.INTEGER,
        allowNull: false
    }
});
//association with product table
Order.belongsToMany(Product,{through:'order_products'});
Product.belongsToMany(Order,{through:'order_products'});

sequelize.sync({force:false}).then(async()=>{
    console.log('order products table created successfully');
}).catch((error)=>{
    console.log('Unable to create Roles table',error);
});
module.exports = OrderProducts;