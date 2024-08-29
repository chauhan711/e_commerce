const {Sequelize,DataTypes} = require('sequelize');
const sequlize = require('../db');

const Role = sequlize.define("roles",{
    id:{
        type:DataTypes.INTEGER,
        allowNull : false,
        primaryKey:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false
    }
});

sequlize.sync({force:false}).then(async()=>{
    console.log('Roles table created successfully');
    await Role.bulkCreate([
        { id:1, name :'Super Admin'},
        {id:2,name:'Admin'},
        {id:3,name:'User'},
        {id:4,name:'Saler'},
    ],{ ignoreDuplicates: true});
}).catch((error)=>{
    console.log('Unable to create Roles table',error);
});
module.exports = Role;
