const AdminProxyJson = require('./../../../build/contracts/AdminUpgradeabilityProxy.json')
const deployed = require('./deployed_addresses.json')

module.exports = function(web3) {
  const ADMIN_PROXY_ADDR = deployed.marketplace

  const AdminProxy = new web3.eth.Contract(AdminProxyJson.abi, ADMIN_PROXY_ADDR)
  return AdminProxy
}
