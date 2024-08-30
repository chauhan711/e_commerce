const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../db.js');
const RoleModel = require('./role.model.js');
const UserRoles = require('./userRole.model.js');
const User = sequelize.define("users", {
    id : {
      type : DataTypes.INTEGER,
      autoIncrement : true,
      primaryKey : true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    authSource: {
      // enum: ['self', 'google'],
      type: Sequelize.STRING,
      // default: 'Google'
      allowNull: true,
    }
 });
User.belongsToMany(RoleModel,{through:'user_has_roles'});
RoleModel.belongsToMany(User,{through:'user_has_roles'});

sequelize.sync({ force: false }).then(async() => {
  console.log('Users table created successfully!');
  await User.bulkCreate([
    {
      id:1,
      name:'manish dev',
      email :'manish.k@yopmail.com',
      password : '$2a$10$DSWbtiKUSfp.EEPw8I3h9ObCQ1bdeaP3E4LuRi1oXHltXUuWYdBsi'
    },
    {
      id:2,
      name:'manish user',
      email :'manish.user@yopmail.com',
      password : '$2a$10$DSWbtiKUSfp.EEPw8I3h9ObCQ1bdeaP3E4LuRi1oXHltXUuWYdBsi'
    },
    {
      id:3,
      name:'saler acc',
      email :'saler@yopmail.com',
      password : '$2a$10$DSWbtiKUSfp.EEPw8I3h9ObCQ1bdeaP3E4LuRi1oXHltXUuWYdBsi'
    },
    {
      id:4,
      name:'test user',
      email :'testuser1@yopmail.com',
      password : '$2a$10$DSWbtiKUSfp.EEPw8I3h9ObCQ1bdeaP3E4LuRi1oXHltXUuWYdBsi'
    },
    {
      id:5,
      name:'test user1',
      email :'testuser2@yopmail.com',
      password : '$2a$10$DSWbtiKUSfp.EEPw8I3h9ObCQ1bdeaP3E4LuRi1oXHltXUuWYdBsi'
    },
    {
      id:6,
      name:'test user2',
      email :'testuser2@yopmail.com',
      password : '$2a$10$DSWbtiKUSfp.EEPw8I3h9ObCQ1bdeaP3E4LuRi1oXHltXUuWYdBsi'
    }
  ],{ ignoreDuplicates: true});

    //give roles to users
  await UserRoles.bulkCreate([
    {userId:1,roleId:1},
    {userId:2,roleId:3},
    {userId:3,roleId:4},
    {userId:4,roleId:3},
    {userId:5,roleId:3},
    {userId:6,roleId:3},
  ],{ignoreDuplicates:true});
}).catch((error) => {
  console.error('Unable to create user table : ', error);
});
module.exports = User;