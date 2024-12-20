const { uuid } = require('../utils.js');
const request = require('../request.js');

module.exports = {
    get: async (order_id) => 
        await request(`api/v3/brokerage/orders/historical/${order_id}`),

    create: async (product_id, side, base_size, limit_price) => 
        await request(`api/v3/brokerage/orders`, 'POST', {
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
    }),

    preview: async (product_id, side, base_size, limit_price) => 
        await request(`api/v3/brokerage/orders/preview`, 'POST', {
        product_id,
        side,
        "order_configuration": {
            "limit_limit_gtc": {
            base_size,
            limit_price,
            "post_only": true
            }
        }
    }),

    edit: async (order_id, size, price) => 
        await request(`api/v3/brokerage/orders/edit`, 'POST', {
        order_id,
        size,
        price
    })
};
