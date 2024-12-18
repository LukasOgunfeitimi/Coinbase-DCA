const fetch = require('node-fetch');
const generateToken = require('./token.js');
const baseUrl = 'https://api.coinbase.com';
    
function req(url, method = 'GET', payload) {
    const token = generateToken(method, "api.coinbase.com", new URL(url).pathname);  
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    };

    const options = {
        method,
        headers,
        body: payload ? JSON.stringify(payload): null
    };

    return new Promise((resolve) => {
        fetch(url, options)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(error => {
            console.error('Error:', error.message);
            resolve({}); 
        });
    });
}

module.exports = req;