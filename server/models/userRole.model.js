const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db');

const UserRole = sequelize.define('user_has_roles',{
    userId :{
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'users',
            key: 'id'
        }
    },
    roleId : {
        type:DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'roles',
            key :'id'
        }
    }
});
module.exports= UserRole;
