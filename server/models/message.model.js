const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db.js');
const userModels = require('./user.model.js');
const conversationModel = require('./conversation.model.js');
const Message = sequelize.define('messages',{
    id : {
        type :DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    userId : {
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'users',
            key: 'id'
        }
    },
    reply : {
        type:DataTypes.STRING,
        allowNull: true,
    },
    conversationId : {
        type:DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : 'users',
            key: 'id'
        }
    }
});
//association with user table
conversationModel.hasMany(Message);
Message.belongsTo(conversationModel);

//association with user table
userModels.hasMany(Message);
Message.belongsTo(userModels);

sequelize.sync({force:false}).then(async()=>{
    console.log('Message table created successfully');
}).catch((error)=>{
    console.log('Message to create Chat table',error);
});
module.exports = Message;