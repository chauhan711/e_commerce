const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db');
const Product = require('./product.model');
const UserModel = require('./user.model');

const userProduct = sequelize.define('users_products',{
    userId :{
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'users',
            key: 'id'
        }
    },
    productId : {
        type:DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'products',
            key :'id'
        }
    },
    quantity : {
        type:DataTypes.INTEGER,
        allowNull : false,
    }
});
Product.belongsToMany(UserModel,{through:'users_products'});
UserModel.belongsToMany(Product,{through:'users_products'});

sequelize.sync({force:false}).then(async()=>{
    await userProduct.bulkCreate([
        // { id:1, userId :2 ,productId:1 , quantity : 1},
        // { id:2, userId :2 ,productId:2 , quantity : 1},
        // { id:3, userId :2 ,productId:3 , quantity : 1}
    ],{ ignoreDuplicates: true});
}).catch((error)=>{
    console.log('Unable to create Roles table',error);
});
module.exports= userProduct;
