/* eslint-disable no-undef */
module.exports = function(Web3) {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum)
    try {
      ethereum.enable()
    } catch (error) {
      console.log(error)
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
  return window.web3
}
