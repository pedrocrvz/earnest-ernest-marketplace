<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
/* eslint-disable */
import Web3 from 'web3'
export default {
  data: () => ({
  }),
  created() {
    this.init()
  },
  methods: {
    async init() {
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          ethereum.enable();
        } 
        catch (error) {
          console.log(error)
        }
      } 
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
      } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
      }
    }
  }
}
</script>
