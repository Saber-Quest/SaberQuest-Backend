const env = require("dotenv").config().parsed
const crypto = require('crypto');

const algorithm = env.ALGORITHM;
const password = env.ENCRYPTION_KEY;

module.exports = {
    encrypt: (text) => {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(password), iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    },
    decrypt: (text) => {
        try {
            const textParts = text.split(':');

            const iv = Buffer.from(textParts.shift(), 'hex');

            const encryptedText = Buffer.from(textParts.join(':'), 'hex');

            const decipher = crypto.createDecipheriv(algorithm, Buffer.from(password), iv);

            const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

            return decrypted.toString();
        } catch (err) {
            return null;
        }
    }
}