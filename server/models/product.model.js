const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db');
const UserModel = require('./user.model');
const Category = require('./category.model');
const Product = sequelize.define("products",{
    id:{
        type:DataTypes.INTEGER,
        allowNull : false,
        primaryKey:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    price : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    quantity : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    category_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references : {
            model : 'categories',
            key :'id'
        },
        onDelete: "CASCADE"
    }
});

sequelize.sync({force:false}).then(async()=>{
    console.log('Products table created successfully');
    await Product.bulkCreate([
        { id:1, name :'samsung galaxy',price:2510,quantity:4,category_id:1},
        {id:2,name:'rolex Cellini',price:2010,quantity:4,category_id:2},
        {id:3,name:'dell i5',price:6520,quantity:3,category_id:3},
        {id:4,name:'Lg tv',price:3210,quantity:2,category_id:4},
    ],{ ignoreDuplicates: true});
}).catch((error)=>{
    console.log('Unable to create Roles table',error);
});

module.exports = Product;