const fetch = require('node-fetch');
const generateToken = require('./token.js');
const baseURL = 'https://api.coinbase.com/';
    
function req(url, method = 'GET', payload) {
    const endpoint = baseURL + url;
    const token = generateToken(method, "api.coinbase.com", new URL(endpoint).pathname);  
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
        fetch(endpoint, options)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(error => {
            console.error('Error:', error.message);
            resolve({}); 
        });
    });
}

module.exports = req;