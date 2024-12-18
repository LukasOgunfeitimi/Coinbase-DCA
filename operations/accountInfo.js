const { account } = require('../requests');
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

    console.log(data)
};

getAccountInformation();