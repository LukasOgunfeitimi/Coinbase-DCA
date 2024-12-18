const crypto = require('crypto');
const { order, prices, account } = require('./requests');
//const send = require('../webhook.js');
const request = require('./request.js');
const start = new Date('2024-11-20T20:00:00');


const getAccountInformation = async () => {
    const acc = await account.getAllAccounts();
    const { 
        uuid: account_uuid,
        retail_portfolio_id: portfolio_uuid,
        available_balance: value
    } = acc.accounts.find(account => account.name === "GBP Wallet");

	const isEmpty = (obj) => Object.keys(obj).length === 0;
	const getAmounts = data => 
		data.filter(s => s.status === "completed" && new Date(s.created_at) > start)
		.reduce((total, s) => total + parseFloat(s.amount?.amount || 0), 0);

	const balanceRes = await account.getPortfolio(portfolio_uuid);
	const depositsRes = await account.getAccountDeposits(account_uuid);
	const withdrawalsRes = await account.getAccountWithdrawals(account_uuid);

	if (isEmpty(balanceRes) || isEmpty(depositsRes) || isEmpty(withdrawalsRes)) return;

	const worth = parseFloat(balanceRes.breakdown.portfolio_balances.total_balance.value);
	const deposits = getAmounts(depositsRes.data);
	const withdrawals = getAmounts(withdrawalsRes.data);

	const profit = Math.round(worth - (deposits - withdrawals), 2);

	const data = { worth, deposits, withdrawals, profit };

	Promise.resolve(data);
};

/**
 * 1. Get the lowest sell price
 * 2. Place a post only order at the smallest increment below the 
 * 	  lowest sell price to trade with lowest possible fee
 * 3. Check if it's been filled every 10 seconds
 * 4. If it hasn't and the sell price has moved up significantly edit the price.
 * 5. Repeat 3. until it's been filled.
 * @param {*} asset Symbol name
 * @param {*} Size Amount in USD, for some reason Coinbase only let you edit orders in the base price (FET)
 */
const DCA = async (asset, size) => {
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
	
	console.log('Order placed: ', orderInfo.id);

    while (!(await IsOrderFilled(orderInfo.id))) {
        const newPrice = parseFloat(await shouldTryPrice());
        const difference = Math.abs(orderInfo.price - newPrice).toFixed(quoteDigits);

        if (difference > quoteIncrement * 3) {
            console.log('Difference over threshold: ', difference);
            console.log('Order Price: ', orderInfo.price);
            console.log('Current Lowest Bid: ', newPrice);
            console.log('Order size', orderInfo.size);
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

        await new Promise(resolve => setTimeout(resolve, 2000)); 
    }
	return Promise.resolve(orderInfo);
};

const startDCA = async () => {
    try {
        const dca = await DCA('FET-USDT', 0.5); 
        console.log('Order process completed');
		send(1, 'Order filled', '```json\n' + JSON.stringify(dca, null, 4) + '```');
    } catch (e) {
        console.error('Error processing order:', e);
		send(1, 'Error', e);
		//return;
    }
    //setTimeout(startDCA, 60 * 60 * 1000); 
};
//getCoinbase();
startDCA(); 

//module.exports = getCoinbase;
