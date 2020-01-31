<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
      <div class="row">
        <div class="col-xl-12">
          <stats-card>
            <h2 class="mb-0">Open a new store</h2>
            <template slot="footer">
              <span class="text-nowrap">Store</span>
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
              <h3 class="mb-0">Store Request</h3>
            </div>
            <div class="card-body">
              <div class="row icon-examples">
                <div class="col-lg-12 col-md-6">
                  <div class="col-lg-12 col-md-6 card bg-secondary shadow border-0">
                    <form v-if="!requested" role="form">
                      <div class="text-center text-muted mb-4">
                        <h3 class="mb-0">Ask Ernest if you can open a new store</h3>
                      </div>
                      <base-input
                        class="input-group-alternative mb-3"
                        placeholder="Store Name"
                        v-model="storeRequest.name"
                      >
                      </base-input>
                      <base-input
                        class="input-group-alternative mb-3"
                        placeholder="Store Description"
                        v-model="storeRequest.description"
                      >
                      </base-input>

                      <div class="text-center">
                        <base-button
                          v-if="hasRequested"
                          type="primary"
                          @click="addNewStoreRequest"
                          class="my-4"
                          disabled
                          >You already have one request waiting</base-button
                        >
                        <base-button v-else type="primary" @click="addNewStoreRequest" class="my-4"
                          >Request</base-button
                        >
                      </div>
                    </form>
                    <div v-else class="text-center text-muted mb-4">
                      <h3 class="mb-0">Store Requested</h3>
                      <base-button type="primary" @click="requested = false" class="my-4">Ok</base-button>
                    </div>
                  </div>
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
let Marketplace = require('../contracts/Marketplace')(web3)

export default {
  data: () => ({
    currentAddress: '',
    storeRequest: {},
    requested: false,
    hasRequested: false,
  }),
  created() {
    this.currentAddress = web3.givenProvider.selectedAddress
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
        const request = await Marketplace.methods.getStoreRequest(this.currentAddress).call()
        if (request[0] !== '' && request[1] !== '') {
          this.hasRequested = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    async addNewStoreRequest() {
      try {
        if (this.storeRequest.name === undefined || this.storeRequest.description === undefined) {
          throw new Error('Data not valid!')
        }

        await Marketplace.methods
          .requestNewStore(this.storeRequest.name, this.storeRequest.description, this.currentAddress)
          .send({
            from: this.currentAddress,
            gas: 300000,
          })
        this.requested = true
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
