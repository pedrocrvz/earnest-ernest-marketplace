<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-xl-4">
          <stats-card>
            <b>Your Address: </b>
            <template slot="footer">
              <span class="text-nowrap">{{ currentAddress }}</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-4">
          <stats-card>
            <b>Your Balance:</b>
            <template slot="footer">
              <span class="text-nowrap">{{ userBalance }} ETH </span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-4">
          <stats-card>
            <b>Your Role:</b>
            <template slot="footer">
              <span v-if="isAdmin" class="text-nowrap">Marketplace Admin &nbsp;</span>
              <span v-if="isStoreOwner" class="text-nowrap">Store Owner &nbsp;</span>
              <span v-if="!isAdmin && !isStoreOwner" class="text-nowrap">Shopper &nbsp;</span>
            </template>
          </stats-card>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="card-header bg-transparent">
              <h3 class="mb-0">Stores</h3>
            </div>
            <div class="card-body">
              <div class="row icon-examples">
                <div v-if="stores.length === 0" class="col-lg-12 col-md-6">
                  <h3 class="mb-0">No Stores</h3>
                </div>
                <div v-else class="col-lg-12 col-md-6" v-for="(store, index) in stores" :key="index">
                  <router-link
                    :to="{
                      name: 'store',
                      params: { id: store.id },
                    }"
                    class="text-light"
                  >
                    <button
                      type="button"
                      :title="store.name"
                      class="btn-icon-clipboard"
                      data-clipboard-text="air-baloon"
                    >
                      <div>
                        <i :class="store.name"></i>
                        <span
                          ><b>{{ store.name }}</b></span
                        >
                      </div>
                      <div>
                        <span>{{ store.description }}</span>
                      </div>
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const web3 = require('./../web3_connection')(require('web3'))
const Marketplace = require('../contracts/Marketplace')(web3)
const MultiSigWallet = require('../contracts/MultiSigWallet')(web3)

export default {
  data: () => ({
    currentAddress: '',
    stores: [],
    isAdmin: false,
    isStoreOwner: false,
    userBalance: '',
  }),
  created() {
    this.init()
    this.checkCurrentAddress()
  },
  methods: {
    checkCurrentAddress: function() {
      setInterval(() => {
        if (web3.givenProvider.selectedAddress !== this.currentAddress) {
          this.init()
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
    async init() {
      this.currentAddress = web3.givenProvider.selectedAddress
      this.checkIfAdmin()
      this.checkIfStoreOwner()
      this.userBalance = web3.utils.fromWei(await web3.eth.getBalance(this.currentAddress), 'ether')
      const storesAddresses = await Marketplace.methods.getStoresAddresses().call()
      for (const address of storesAddresses) {
        const storeDetails = await Marketplace.methods.getStore(address).call()

        const store = {
          id: address,
          name: storeDetails[0],
          description: storeDetails[1],
          owner: storeDetails[2],
          isBanned: storeDetails[3],
        }
        this.stores.push(store)
      }
    },
  },
}
</script>
