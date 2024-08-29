const {DataTypes} = require('sequelize');
const sequelize = require('../db.js');
const RoleModel = require('./role.model.js');
const RolePermissionModel = require('./rolePermission.model.js');
const Permission = sequelize.define('permissions',{
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type : DataTypes.STRING,
    }
});

Permission.belongsToMany(RoleModel,{through:'roles_has_permissions'});
RoleModel.belongsToMany(Permission,{through:'roles_has_permissions'});
sequelize.sync({force:false})
.then(async()=>{
    console.log('Permissions table created successfully');
    await Permission.bulkCreate([
        {id:1,name:'Admin-Dashboard'},
        {id:2,name:'User-Dashboard'},
        {id:3,name:'Saler-Dashboard'},
    ],{ ignoreDuplicates: true});
    
    //Create Roles Permissions
    await RolePermissionModel.bulkCreate([
    {roleId:1,permissionId:1},
    {roleId:2,permissionId:1},
    {roleId:3,permissionId:2},
    // {roleId:4,permissionId:3},
    ],{ignoreDuplicates: true});
}).catch((error)=>{
    console.log('Unable to create permissions table',error);
});
module.exports = Permission;