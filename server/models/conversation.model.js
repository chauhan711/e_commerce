const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db.js');
const userModels = require('./user.model.js');
const Conversation = sequelize.define('conversations',{
    id : {
        type :DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    user_one : {
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'users',
            key: 'id'
        }
    },
    user_two : {
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'users',
            key: 'id'
        }
    },
    title : {
        type:DataTypes.STRING,
        allowNull: true,
    }
});
//association with user table
userModels.hasMany(Conversation,{foreignKey: 'user_one',as:'user_conversation'});
userModels.hasMany(Conversation,{foreignKey: 'user_two',as:'others_conversation'});

sequelize.sync({force:false}).then(async()=>{
    console.log('Conversation table created successfully');
}).catch((error)=>{
    console.log('Conversation to create Chat table',error);
});
module.exports = Conversation;