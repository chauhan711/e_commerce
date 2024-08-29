const crypto = require('../helpers/cryto.helper');
module.exports.Auth = async(req,res) => {
    try{
        const user = crypto.encryption(req.user);
        res.send({user:user});
    }catch(error){
        res.send({error:error})
    }
}