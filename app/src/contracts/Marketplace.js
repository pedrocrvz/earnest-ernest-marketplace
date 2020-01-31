const MarketplaceJson = require('./../../../build/contracts/Marketplace.json')
const deployed = require('./deployed_addresses.json')

module.exports = function(web3) {
  const MULTISIG_WALLET_ADDR = deployed.marketplace

  const Marketplace = new web3.eth.Contract(MarketplaceJson.abi, MULTISIG_WALLET_ADDR)
  return Marketplace
}
