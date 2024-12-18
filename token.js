const crypto = require('crypto');
const { sign } = require('jsonwebtoken');
const { API_NAME, API_KEY } = require('./config.js');
const { name, privateKey } = {
    "name": API_NAME,
    "privateKey": API_KEY
};

function generateToken(method, url, path) {
    const algorithm = "ES256";
    const uri = `${method} ${url}${path}`;

    return sign({
        iss: "cdp",
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        sub: name,
        uri,
    },
    privateKey, 
    {
        algorithm,
        header: {
        kid: name,
        nonce: crypto.randomBytes(16).toString("hex"),
        },
    }
    );
}

module.exports = generateToken;