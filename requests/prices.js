const request = require('../request.js');

module.exports = {
    getAsset: async (product_id) => 
        await request(`api/v3/brokerage/products/${product_id}`),

    getBidAsk: async (product_id) =>
        await request(`api/v3/brokerage/best_bid_ask?product_ids=${product_id}`)
}
