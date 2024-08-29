const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require('../db.js');
const blacklist = sequelize.define('blacklists',{
    id : {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    token : {
        type:DataTypes.STRING,
        allowNull : false
    }
});
sequelize.sync({ force: false }).then(() => {
    console.log('Blacklists table created successfully!');
  }).catch((error) => {
    console.error('Unable to create user table : ', error);
  });
module.exports = blacklist;