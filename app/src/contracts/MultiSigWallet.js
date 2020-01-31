const MultiSigWalletJson = require('./../../../build/contracts/MultiSigWallet.json')
const deployed = require('./deployed_addresses.json')
module.exports = function(web3) {
  const MULTISIG_WALLET_ADDR = deployed.multisig

  const MultiSigWallet = new web3.eth.Contract(MultiSigWalletJson.abi, MULTISIG_WALLET_ADDR)
  return MultiSigWallet
}
