<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar :background-color="sidebarBackground" short-title="Marketplace" title="Marketplace">
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'ni ni-tv-2 text-primary',
            path: '/dashboard',
          }"
        />

        <sidebar-item
          v-if="isStoreOwner"
          :link="{ name: 'My Stores', icon: 'ni ni-planet text-blue', path: '/my-stores' }"
        />

        <sidebar-item v-if="isAdmin" :link="{ name: 'Admin', icon: 'ni ni-planet text-blue', path: '/admin' }" />

        <sidebar-item
          v-if="!isAdmin"
          :link="{ name: 'RequestStore', icon: 'ni ni-money-coins text-blue', path: '/request-store' }"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      </div>
    </div>
  </div>
</template>
<script>
import { FadeTransition } from 'vue2-transitions'
const web3 = require('./../web3_connection')(require('web3'))
const MultiSigWallet = require('../contracts/MultiSigWallet')(web3)
const Marketplace = require('../contracts/Marketplace')(web3)
export default {
  components: {
    FadeTransition,
  },
  data() {
    return {
      currentAddress: '',
      isAdmin: false,
      isStoreOwner: false,
      sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
    }
  },
  created() {
    this.currentAddress = web3.givenProvider.selectedAddress
    this.checkIfAdmin()
    this.checkIfStoreOwner()
    this.checkCurrentAddress()
  },
  methods: {
    checkCurrentAddress: function() {
      setInterval(() => {
        if (web3.givenProvider.selectedAddress !== this.currentAddress) {
          this.currentAddress = web3.givenProvider.selectedAddress
          this.checkIfAdmin()
          this.checkIfStoreOwner()
        }
      }, 1000)
    },
    async checkIfAdmin() {
      const admins = await MultiSigWallet.methods.getOwners().call()
      this.isAdmin = admins.some(address => address.toLowerCase() === this.currentAddress)
    },
    async checkIfStoreOwner() {
      this.isStoreOwner = await Marketplace.methods.isStoreOwner(this.currentAddress).call()
    },
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false)
      }
    },
  },
}
</script>
<style lang="scss"></style>
