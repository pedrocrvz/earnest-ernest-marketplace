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

### Contracts

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

### App

Naviagte to folder `app`:

```
cd app
```

Install dependencies:

```
npm install
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
npm run serve
```

Next open the MetaMask extension and then click "Restore from seed phrase" and use the seed phrase displayed in ganache. Connect MetaMask to ganache. Make sure to have at least 3 accounts available (if you only have one, click "Create Account" on MetaMask and add more accounts). The first account is the owner of the multisig and the marketplace admin. Second and third accounts are already registered as stores owners to facilidate and ease demonstration.

Note: The migrations file is configured to add new stores after the marketplace deployment to ease testing. To start with an empty marketplace you can simply remove the stores adition in file `2_initial_migration.js`.

## Docs

All the required documentation are located at the folder `docs`.

## Roles

### Marketplace Admins

The marketplace is controlled by a multisig wallet. The owners of the multisig wallet are the admins of the marketplace. Admins can create/ban/remove stores.

<img src="docs/img/admin.png " alt="adminview" width="1000"/>

### Shoppers/Users

Users can buy products or request to open a new store.

<img src="docs/img/dashboard.png " alt="dashboard" width="1000"/>

### Store Owners

Store owners can create/update/remove products, withdraw the store balance to their account and destroy the store.

<img src="docs/img/storeowner.png " alt="storeowner" width="1000"/>
