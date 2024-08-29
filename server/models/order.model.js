const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db.js');
const Product = require('./product.model.js');
const userModels = require('./user.model.js');
const Order = sequelize.define('orders',{
    id:{
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    userId : {
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'users',
            key: 'id'
        }
    },
    paymentId :{
        type : DataTypes.STRING,
        allowNull: false
    },
    payment_status :{
        type:DataTypes.STRING,
        allowNull: false,
    },
    status :{
        type:DataTypes.STRING,
        allowNull: false
    },
    latest_charge :{
        type:DataTypes.STRING,
        allowNull: true
    },
    total_amount :{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    payment_received :{
        type:DataTypes.INTEGER,
        allowNull: false,
    }
});

//association with user table
userModels.hasMany(Product);
Order.belongsTo(userModels);

sequelize.sync({force:false}).then(async()=>{
    console.log('order table created successfully');
}).catch((error)=>{
    console.log('Unable to create Roles table',error);
});
module.exports = Order;