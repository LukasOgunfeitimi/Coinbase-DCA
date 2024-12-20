const getProfit = require('./operations/profit.js');

module.exports = async (send, date) => {
    if (date.length === 0) date = undefined;
    send('```json\n' + JSON.stringify(await getProfit(date), null, 4) + '```');
}

