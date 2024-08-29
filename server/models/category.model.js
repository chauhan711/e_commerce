const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db.js');

const category = sequelize.define('categories',{
    id : {
        type : DataTypes.INTEGER,
        authIncrement : true,
        primaryKey : true
    },
    name : {
        type :DataTypes.STRING,
    }
});
sequelize.sync({force:false})
.then(async()=>{
    console.log('Category table created successfully');
    await category.bulkCreate([
        {id:1,name:'mobiles'},
        {id:2,name:'laptops'},
        {id:3,name:'tv'},
        {id:4,name:'watches'}
    ],{ignoreDuplicates:true});
}).catch((error)=>{
    console.log('Unable to create Category table.');
});
module.exports = category;