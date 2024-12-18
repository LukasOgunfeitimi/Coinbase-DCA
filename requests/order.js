const uuidv4 = require('../utils/uuid4.js')
const request = require('../request.js');
const baseUrl = 'https://api.coinbase.com';
const portfolio_uuid = '48c3e762-030b-532e-9bfe-784d71231c3d';
const account_uuid = '088f02f0-d1bd-5de5-b0ad-3ae2fefaba05';

module.exports.get = async (order_id) =>
    await request(`https://api.coinbase.com/api/v3/brokerage/orders/historical/${order_id}`)

module.exports.create = async (product_id, side, base_size, limit_price) => 
    await request(`https://api.coinbase.com/api/v3/brokerage/orders`, 'POST', {
        "client_order_id": uuidv4(),
        product_id,
        side,
        "order_configuration": {
            "limit_limit_gtc": {
            base_size,
            limit_price,
            "post_only": true
            }
        }
    })

module.exports.preview = async (product_id, side, base_size, limit_price) =>
    await request(`https://api.coinbase.com/api/v3/brokerage/orders/preview`, 'POST', {
        product_id,
        side,
        "order_configuration": {
            "limit_limit_gtc": {
            base_size,
            limit_price,
            "post_only": true
            }
        }
    })

module.exports.edit = async (order_id, size, price) =>
    await request(`https://api.coinbase.com/api/v3/brokerage/orders/edit`, 'POST', {
        order_id,
        size,
        price
    })


/*
  const balanceRes = await req(`${baseUrl}/api/v3/brokerage/portfolios/${portfolio_uuid}`, 'GET');
  const depositsRes = await req(`${baseUrl}/v2/accounts/${account_uuid}/deposits`, 'GET');
  const withdrawalsRes = await req(`${baseUrl}/v2/accounts/${account_uuid}/withdrawals`, 'GET');

  */