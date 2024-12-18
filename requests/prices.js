const uuidv4 = require('../utils/uuid4.js')
const request = require('../request.js');
const baseUrl = 'https://api.coinbase.com';
const portfolio_uuid = '48c3e762-030b-532e-9bfe-784d71231c3d';
const account_uuid = '088f02f0-d1bd-5de5-b0ad-3ae2fefaba05';

module.exports.getPrice = async (product_id) => 
    await request(`https://api.coinbase.com/api/v3/brokerage/products/${product_id}`)


module.exports.getBidAsk = async (product_id) =>
    await request(`https://api.coinbase.com/api/v3/brokerage/best_bid_ask?product_ids=${product_id}`)
