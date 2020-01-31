const StoreJson = require('./../../../build/contracts/Store.json')

module.exports = function(web3, STORE_ADDR) {
  return new web3.eth.Contract(StoreJson.abi, STORE_ADDR)
}
