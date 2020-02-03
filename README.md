# Earnest Ernest Marketplace

Decentralized marketplace controlled by a multisig wallet. Owner of the multisig wallet are the admins of the marketplace.
Admins can create/ban/remove stores.
Users can buy products or request to open a new store.
Store owners can create/update/remove products and withdraw the store balance to thei account.

# Requirements

- [Truffle](https://www.trufflesuite.com/truffle) (npm install -g truffle)
- [Ganache](https://www.trufflesuite.com/ganache)
  - CLI (npm install -g ganache-cli) or [GUI](https://www.trufflesuite.com/ganache)
- [MetaMask](https://metamask.io)

## User Interface Requirements:

- [x] Run the app on a dev server locally for testing/grading
- [x] You should be able to visit a URL and interact with the application
  - [x] App recognizes current account
  - [x] Sign transactions using MetaMask or uPort
  - [x] Contract state is updated
  - [x] Update reflected in UI

## Test Requirements:

- [x] Write 5 tests for each contract you wrote
  - [x] Solidity or JavaScript
- [x] Explain why you wrote those tests
- [x] Tests run with truffle test

## Design Pattern Requirements:

- [x] Implement a circuit breaker (emergency stop) pattern
- [x] What other design patterns have you used / not used?
  - [x] Why did you choose the patterns that you did?
  - [x] Why not others?

## Security Tools / Common Attacks:

- [x] Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks

## Use a library or extend a contract

- [x] Via EthPM or write your own

## Other

- [x] Deploy your smart contract(s) onto one of the test (i.e. Rinkeby, Ropsten) networks.
- [x] Include a document called deployed_addresses.txt that describes where your contracts live (which testnet and address).
      Evaluators can check the appropriate testnet etherscan at the provided addresses to verify deployment
