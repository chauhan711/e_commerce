const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const BlacklistModel = require('../models/blacklist.model');
const UserModel = require('../models/user.model.js');
const RolesModel = require('../models/role.model.js');
const PermissionModel = require('../models/permission.model.js');
async function verifyToken(req,res,next){
    try{
        if(!req.headers.authorization) {return res.status(400).send({error:'You are not authorized'});}
        var authorization = req.headers.authorization.split(' ');
        if(!authorization[0] == 'Bearer' && !authorization[1]) return res.status(401).json({message:'Unauthorize user'});

        //check that user token is already blacklisted
        const blacklistToken = await BlacklistModel.findOne({where:{token:authorization[1]}});
        if(blacklistToken) return res.status(400).send({message:'Unauthorize user'});
        
        const {userId} = jwt.verify(authorization[1],JWT_SECRET);
        const user = await UserModel.findOne({
            where:{id:userId},
            include: {
                model    : RolesModel,
                through  : {attributes:[]},
                required : false,
                include  : {
                    model : PermissionModel,
                    through : {attributes:[]},
                    required : false
                }
            }
        });
        req.user = user;
        next();
    } catch(err)
    {
        console.log('err',err);
        res.status(400).send({error:err});
    }
};
module.exports = {verifyToken};