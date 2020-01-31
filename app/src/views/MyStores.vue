<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt- pt-md-8">
      <div class="row">
        <div class="col-xl-6">
          <stats-card>
            <b>Number of stores: </b>
            <template slot="footer">
              <span class="text-nowrap">{{ stores.length }}</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-6">
          <stats-card>
            <b>Combined balance of stores:</b>
            <template slot="footer">
              <span class="text-nowrap">{{ totalStoresBalance }} ETH </span>
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
                      name: 'my-store',
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
let Marketplace
export default {
  data: () => ({
    currentAddress: '',
    stores: [],
    totalStoresBalance: 0,
  }),
  created() {
    this.currentAddress = web3.givenProvider.selectedAddress
    Marketplace = require('../contracts/Marketplace')(web3)
    this.init()
    this.checkCurrentAddress()
  },
  methods: {
    checkCurrentAddress: function() {
      setInterval(() => {
        if (web3.givenProvider.selectedAddress !== this.currentAddress) {
          this.currentAddress = web3.givenProvider.selectedAddress
          this.$router.push({ name: 'dashboard' })
        }
      }, 1000)
    },

    async init() {
      try {
        const stores = await Marketplace.methods.getStoresByOwner(this.currentAddress).call()
        for (const store of stores) {
          this.totalStoresBalance += await web3.eth.getBalance(store)
          const storeDetails = await Marketplace.methods.getStore(store).call()
          this.stores.push({
            id: store,
            name: storeDetails[0],
            description: storeDetails[1],
            owner: storeDetails[2],
            isBanned: storeDetails[3],
          })
        }
        this.totalStoresBalance = web3.utils.fromWei(this.totalStoresBalance.toString(), 'ether')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
