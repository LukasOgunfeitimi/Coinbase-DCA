# Coinbase DCA (Dollar Cost Averaging) API Wrapper

This project provides a wrapper around the Coinbase Brokerage API with a focus on implementing Dollar Cost Averaging (DCA) functionality. The wrapper allows you to automate the process of purchasing an asset at regular intervals, while adjusting the order price dynamically based on market conditions.

## Features

- Automated DCA strategy for specified assets
- Dynamic order price adjustment based on market fluctuations
- Account and portfolio management (fetching details of portfolios, deposits, and withdrawals)
- Order management (create, preview, edit orders)
- Historical order retrieval

## DCA Strategy

The DCA feature will utilise the [`POST ONLY`](#info) execution type to minimise fees.

To use this execution type, we need to place a limit order at a price that is slightly below the opposite side of the trade.

eg. if we want to buy `BTC-USDT` and it's lowest sell price is `$51,344.32`, we simply need to make a limit order anything below this price (preferable the smallest increment possible under it `$51,344.31`).

After we constantly check the order to see if it's been filled. If it keep's moving against our direction we will simply edit the order and keep the limit price close to the opposite price of the asset.

<img src="https://raw.githubusercontent.com/LukasOgunfeitimi/Coinbase-DCA/main/DCA.png" alt="DCA Image" width="250" />

In this example, I placed an order to buy `FET-USDT` at `1.5781`, but it monitored that the priced directly below the lowest sell price was `1.5789`, therefore it edited the order at that price and later it was filled.

In every [fee tier](https://help.coinbase.com/en/exchange/trading-and-funding/exchange-fees) in Coinbase you will see being the maker will save you about a half on fees than being a taker. This project will attempt to place orders like you're a taker but they're actually maker orders. 
### DCA Workflow:
1. **Price Monitoring**: Continuously monitors the lowest bid price for the asset.
2. **Order Placement**: Places an order based on a calculated price.
3. **Dynamic Price Adjustment**: If the market price changes significantly, the order is updated.
4. **Order Completion**: The process continues until the order is filled.

## Setup

### Prerequisites

- Node.js and npm installed on your system.
- Access to the [Coinbase API](https://www.coinbase.com/) with a valid API name and key. 
- Input the API name and key in the `config.js` file.

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/LukasOgunfeitimi/Coinbase-DCA.git
   cd Coinbase-DCA

### Info 
What is a `POST ONLY` order?
> [Coinbase Order Types](https://help.coinbase.com/en/coinbase/trading-and-funding/advanced-trade/order-types)
> Post only will ensure that your limit order is posted to the order book and sits on the order book to be charged maker fees if it is filled. If any part of the order is executed immediately due to its price when arriving at the matching engine, the entire order will be rejected. This is useful for ensuring that an order is not subject to taker fees, if desired.
