const CryptoJS = require('crypto-js');
const encryption = (data) => {
    let decrpytedData = '';
    if (data.constructor == Array || typeof data === 'object') 
    {
        decrpytedData = JSON.stringify(data);
    }
    else{
        decrpytedData = data;
    }
    // encrypt the message using AES encryption
    const ciphertext = CryptoJS.AES.encrypt(decrpytedData,process.env.CRYPTO_SECRET_KEY).toString();
    return ciphertext;
}
const decryption = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_SECRET_KEY);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}
module.exports = {encryption,decryption};