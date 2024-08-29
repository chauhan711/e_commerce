const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const crypto = require('../helpers/cryto.helper');
const RolesModel = require('../models/role.model.js');
const PermissionModel = require('../models/permission.model.js');

const UserModel = require('../models/user.model');
const blacklistModel = require('../models/blacklist.model');

//Login
module.exports.login = async(req,res) => {
    try{
        const {email,password} = req.body;

        const user = await UserModel.findOne({
            where:{email:email},
            include: {
                model : RolesModel,
                through : {attributes:[]},
                include : {
                    model : PermissionModel,
                    through : {attributes:[]}
                }
            }
        });

        if(!user) {return res.status(400).send({error:'Wrong Credentials'});}
        
        //check password
        const checkPassword = await bcrypt.compare(password,user.password);

        if(checkPassword != true) {return res.status(400).send({error:'Wrong Credentials'});}

        //create token
        const token = jwt.sign({userId:user.id},JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
       
        //Encrypt data before giving response
        const encryptedData = crypto.encryption(user);

        res.status(200).send({token:token,user:encryptedData});
    }catch(err){
        console.log(err);
        res.status(400).send({error:err});
    }
}

//login with google
module.exports.googleAuth = async(req, res) => {
    const { credential, client_id } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        // Check if the user exists in your database
        const user = await UserModel.findOne({where:{email:payload.email} });
        if (!user) {
            //encrypt password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(payload.sub, salt);
            user = await UserModel.create({
                email:payload.email,
                name: `${payload.given_name} ${payload.family_name}`,
                password : hashedPassword,
                authSource: 'google',
            });
        }
        // Generate a JWT token
        const token = jwt.sign({ userId:user.id }, JWT_SECRET , {expiresIn:process.env.JWT_EXPIRES_IN});
        res.status(200).json({ token:token });

        // const token = jwt.sign({ user }, JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        // res.status(200).cookie('token', token, { http: true }).json({ payload });
    } catch (err) {
        res.status(400).send({ err });
    }
};

//logout
module.exports.logout = async(req,res) => {
    try{
        const authHeader = req.headers["authorization"].split(' ');
        const BlacklistToken = await blacklistModel.findOne({where:{token:authHeader[1]}});
        if(!BlacklistToken) {
            blacklistModel.create({token:authHeader[1]});
            return res.send({success : 'You have been Logged Out'});
        }
        else{
            return res.send({message:'Please Login first'});
        }
    }catch(err)
    {
        res.send({msg:'Error'});
    }
}