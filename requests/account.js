const request = require('../request.js');

module.exports = {
  getAllAccounts: async () => 
    await request('api/v3/brokerage/accounts'),

  getAccountDeposits: async (account_uuid) => 
    await request(`v2/accounts/${account_uuid}/deposits`),

  getAccountWithdrawals: async (account_uuid) => 
    await request(`v2/accounts/${account_uuid}/withdrawals`),

  getAllPortfolios: async () => 
    await request('api/v3/brokerage/portfolios'),

  getPortfolio: async (portfolio_uuid) => 
    await request(`api/v3/brokerage/portfolios/${portfolio_uuid}`)
};
