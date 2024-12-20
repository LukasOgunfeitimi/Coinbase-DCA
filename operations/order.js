const { order, prices } = require('../requests/index.js');
const { sleep } = require('../utils.js');

/**
 * Place an order using POST_ONLY to save on fees
 * 1. Get the lowest sell price
 * 2. Place a post only order at the smallest increment below the 
 * 	  lowest sell price to trade with lowest possible fee
 * 3. Check if it's been filled every 10 seconds
 * 4. If it hasn't and the sell price has moved up significantly edit the price.
 * 5. Repeat 3. until it's been filled.
 * @param {*} asset Symbol name
 * @param {*} Size Amount in base size, for some reason Coinbase only let you edit orders in the base price (FET)
 */
async function placeOrder(asset, size) {
    const info = await prices.getAsset(asset);
    if (info.error) Promise.reject(info.message);
    console.log("Starting DCA for " + info.product_id);

    const quoteDigits = info.quote_increment.split('.')[1].length;
    const quoteIncrement = parseFloat(info.quote_increment);
    const baseIncrement = info.base_increment.split('.')[1].length;

    const IsOrderFilled = async (order_id) => (await order.get(order_id)).order.status === 'FILLED';
    const getLowestBid = async () => (await prices.getBidAsk(asset)).pricebooks.find(price => price.product_id === asset).bids[0].price;
    const shouldTryPrice = async () => (await getLowestBid() - quoteIncrement).toFixed(quoteDigits).toString();

    const reqPrice = await shouldTryPrice();
    const request = await order.create(asset, 'BUY', ((size / parseFloat(reqPrice)).toFixed(baseIncrement)).toString(), reqPrice);
    if (!request.success) return Promise.reject(request.error_response);

    let orderInfo = {
        id: request.success_response.order_id,
        size: request.order_configuration.limit_limit_gtc.base_size,
        price: parseFloat(request.order_configuration.limit_limit_gtc.limit_price),
    };

    console.log('Order placed: ', orderInfo.id + '\nPrice: ' + orderInfo.price);

    while (!(await IsOrderFilled(orderInfo.id))) {
        const newPrice = parseFloat(await shouldTryPrice());
        const difference = Math.abs(orderInfo.price - newPrice).toFixed(quoteDigits);

        if (difference > quoteIncrement * 3) {
            const edit = await order.edit(orderInfo.id, orderInfo.size, newPrice.toString());
            if (edit.success) {
                console.log('Edited order to: ', newPrice);
                orderInfo.price = newPrice;
            } else {
                if (edit.errors[0]?.edit_failure_reason === 'ORDER_NOT_FOUND') continue; // the order was filled while trying to edit
                console.log('Failed order edit', edit);
            }
            console.log('------------------------------------');
        } else {
            console.log('Difference not over threshold ' + difference);
            console.log('------------------------------------');
        }

        await sleep(2000); 
    }

    // make last get order request to retrieve final fee
    return Promise.resolve(orderInfo);
};

module.exports = placeOrder;