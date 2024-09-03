const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require('../db.js');
const userModels = require('./user.model.js');
const MessageModel = require('./message.model.js')
const Storage = sequelize.define('storages',{
    id : {
        type :DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    originalname : {
        type:DataTypes.STRING,
        allowNull: false,
    },
    mimetype : {
        type:DataTypes.STRING,
        allowNull: false
    },
    destination  : {
        type:DataTypes.STRING,
        allowNull: false
    },
    storageableId : {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    storageableType : {
        type:DataTypes.STRING,
        allowNull: false,
    },
    filename : {
        type:DataTypes.STRING,
        allowNull: false,
    },
    path : {
        type:DataTypes.STRING,
        allowNull: false,
    }
});

//association with messages table
MessageModel.hasMany(Storage, {
    foreignKey: 'storageableId',
    constraints: false,
    scope: {
        storageableType: 'message',
    }
});
Storage.belongsTo(MessageModel,{ foreignKey: 'storageableId', constraints: false });

sequelize.sync({force:false}).then(async()=>{
    console.log('storage table created successfully');
}).catch((error)=>{
    console.log('storage to create Chat table',error);
});
module.exports = Storage;