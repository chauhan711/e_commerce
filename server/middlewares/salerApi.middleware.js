const {appPermission} = require('../helpers/appPermissions.helper');
module.exports.salerApiPermission = async(req,res,next)=>{
   try{
        const user = req.user;
        const permissions = user?.roles[0]?.permissions;
        const allPermissions = [];
        if(Array.isArray(permissions))
        {
            permissions.forEach(function(item,key){
                allPermissions.push(item.name);
            });
        }
        if(allPermissions?.includes(appPermission.Saler_Dashboard)) {
            next();
        }else{
            res.status(400).send({error:'You are not a authorize persion for Saler APIs'});
        };
   }
   catch(err){
        res.send({error:err});
   }
}