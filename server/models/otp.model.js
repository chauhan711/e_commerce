const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db');
const UserModel = require('./user.model');
const otp = sequelize.define("otps",{
    id:{
        type:DataTypes.INTEGER,
        allowNull : false,
        primaryKey:true
    },
    generated_otp:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    received_otp: {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references : {
            model : 'users',
            key :'id'
        },
        onDelete: "CASCADE"
    }
});
UserModel.hasOne(otp, {foreignKey: 'user_id'});
otp.belongsTo(UserModel, {foreignKey: 'user_id'});
module.exports = otp;
