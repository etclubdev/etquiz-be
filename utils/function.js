import pkg from 'crypto-js';
const { AES, enc } = pkg;
export const encryptData = (data) => {
    return btoa(AES.encrypt(JSON.stringify(data), process.env.CRYPTO_SECRET_KEY).toString());
};

export const decryptData = (data) => {
    const decryptedBytes = AES.decrypt(atob(data), process.env.CRYPTO_SECRET_KEY);
    return decryptedBytes.toString(enc.Utf8)
};