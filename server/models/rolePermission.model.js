const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db');

const rolePermission = sequelize.define('roles_has_permissions',{
    roleId :{
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'roles',
            key: 'id'
        },
        onDelete: "CASCADE"
    },
    // PermissionId : {
    //     type:DataTypes.INTEGER,
    //     allowNull : false,
    //     references : {
    //         model : 'permissions',
    //         key :'id'
    //     },
    //     onDelete: "CASCADE"
    // }
});
module.exports= rolePermission;
