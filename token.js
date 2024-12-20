const crypto = require('crypto');
const { sign } = require('jsonwebtoken');
const { API_NAME, API_KEY } = require('./config.js');

function generateToken(method, url, path) {
    const algorithm = "ES256";
    const uri = `${method} ${url}${path}`;

    return sign({
        iss: "cdp",
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        sub: API_NAME,
        uri,
    },
    API_KEY, 
    {
        algorithm,
        header: {
            kid: API_NAME,
            nonce: crypto.randomBytes(16).toString("hex"),
        },
    }
    );
}

module.exports = generateToken;