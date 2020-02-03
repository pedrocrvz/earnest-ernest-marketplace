# Earnest Ernest Marketplace

Decentralized marketplace written in Solidity.

## Requirements

- [Truffle](https://www.trufflesuite.com/truffle) (npm install -g truffle)
- [Ganache](https://www.trufflesuite.com/ganache)
  - CLI (npm install -g ganache-cli) or [GUI](https://www.trufflesuite.com/ganache)
- [MetaMask](https://metamask.io)
- [Node.js](https://nodejs.org/en/)

## Installation

Once you have Node.js, truffle, ganache and Metamask installed in your system, follow the steps:

Clone Earnest Ernest Marketplace's repository:

```
git clone https://github.com/pedrocrvz/earnest-ernest-marketplace.git
cd earnest-ernest-marketplace
```

Install dependencies:

```
npm install
```

Start ganache (GUI or CLI):

```
ganache-cli
```

Compile contracts:

```
truffle compile
```

## Tests

All the tests are placed in the folde `tests`. To run all tests type:

```
truffle test
```

## Run Project

First we need to migrate the contract:

```
truffle migrate
```

Then we need to initiate our app to serve as a GUI to interact with the contracts:

```
cd app
npm run start
```

Note: The migrations file is configured to add new stores after the marketplace deployment to ease testing. To start with an empty marketplace you can simply remove the stores adition in file `2_initial_migration.js`.

## Docs

All the required documentation are located at the folder `docs`.

## Roles

### Marketplace Admins

The marketplace is controlled by a multisig wallet. The owners of the multisig wallet are the admins of the marketplace. Admins can create/ban/remove stores.

### Shoppers/Users

Users can buy products or request to open a new store.

### Store Owners

Store owners can create/update/remove products, withdraw the store balance to their account. and destroy the store
