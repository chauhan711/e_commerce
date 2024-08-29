const {appPermission} = require('../helpers/appPermissions.helper');
async function userApiPermission(req,res,next){
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
        if(allPermissions?.includes(appPermission.User_Dashboard)) {
            next();
        }else{
            return res.status(400).send({error:'You are not a authorize persion for User APIs'});
        };
   }
   catch(err){
        res.send({error:err});
   }
};
module.exports = {userApiPermission};