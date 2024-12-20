const Order = require('./operations/order.js');

// args: <asset-name> <base-size> <interval-in-minutes>
const [asset, size, minutes] = process.argv.slice(2);

const startDCA = async () => {
    try {
        const dca = await Order(asset, parseFloat(size)); 
        console.log('Order process completed');
        await sleep(parseInt(minutes) * 60 * 1000);
        startDCA();
    } catch (e) {
        console.error('Error processing order:', e);
    }
};

startDCA();