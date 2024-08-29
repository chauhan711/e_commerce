import CryptoJS from 'crypto-js';
class helper{
    decryption(user){
        var bytes  = CryptoJS.AES.decrypt(user, process.env.REACT_APP_CRYPTO_SECRET_KEY);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        var parsedtext = JSON.parse(originalText);
        return parsedtext;
    }
    checkRole(user,roleId)
    {
        const user_roleId = user?.roles[0]?.id;
        if(user_roleId === roleId) return true;
        return false;
    }
    verifyRole(encryptedUser,roles)
    {
        const user = this.decryption(encryptedUser);
        if(Object.values(roles).includes(user?.roles[0]?.id))
        {
            return true;
        }
        return false;
    }
    checkPermission(user,permission)
    {
        const permissions = user?.roles[0]?.permissions;
        const allPermissions = [];
        if(Array.isArray(permissions))
        {
            permissions.forEach(function(item,key){
                allPermissions.push(item.name);
            });
        }
        if(allPermissions?.includes(permission)) {
            return true;
        }else{
            return null;
        };
    }
    getCurrentUser()
    {
        const user = localStorage.getItem('user');
        const authUser = this.decryption(user);
        return authUser;
    }
    getHeaders() {
        const token = localStorage.getItem('token');
        const headers = {headers:{Authorization:`Bearer ${token}`}};
        return headers;
    }
    getAdminName()
    {
        return 'Admin';
    }
}
const helpers = new helper();
export default helpers;
