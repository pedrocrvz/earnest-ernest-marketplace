<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-xl-6">
          <stats-card> <b>Implementation Address: </b> {{ implementation }} </stats-card>
        </div>
        <div class="col-xl-6">
          <stats-card> <b>MultiSigWallet Address: </b> {{ adminMultisig }} </stats-card>
        </div>
      </div>
      <base-header type="gradient-success" class=" pb-2 pb-2 pt-2 pt-md-4">
        <div class="row">
          <div class="col-xl-12"></div>
        </div>
      </base-header>
      <div class="row">
        <div class="col-xl-4">
          <stats-card>
            <b>Number Of Admins: </b> {{ admins.length }}
            <template slot="footer">
              <span class="text-nowrap">Total number of marketplace admins</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-4">
          <stats-card>
            <b>Required Confirmations:</b> {{ required }}
            <template slot="footer">
              <span class="text-nowrap">Total confirmations required to submit a transaction</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-4">
          <stats-card>
            <b>Transaction Count:</b> {{ txCount }}
            <template slot="footer">
              <span class="text-nowrap">Total transactions done via multisig</span>
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
              <h3 class="mb-0">Admin Features</h3>
            </div>
            <div class="card-body">
              <div class="row icon-examples">
                <div class="col-lg-12 col-md-4 card bg-secondary shadow border-0">
                  <form role="form">
                    <div class="text-center text-muted mb-4">
                      <h3 class="mb-0">Add New Admin</h3>
                    </div>
                    <base-input class="input-group-alternative mb-3" placeholder="New Admin Address" v-model="newAdmin">
                    </base-input>
                    <div class="text-center">
                      <base-button type="primary" @click="addNewAdmin" class="my-4">Add</base-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <base-header type="gradient-success" class=" pb-2 pb-2 pt-2 pt-md-4">
              <div class="row">
                <div class="col-xl-12"></div>
              </div>
            </base-header>
            <div class="card-body">
              <div class="row icon-examples">
                <div class="col-lg-12 col-md-4 card bg-secondary shadow border-0">
                  <form role="form">
                    <div class="text-center text-muted mb-4">
                      <h3 class="mb-0">Upgrade Contract</h3>
                    </div>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="New Marketplace Implementation Address"
                      v-model="newImplementation"
                    >
                    </base-input>
                    <div class="text-center">
                      <base-button type="primary" @click="upgradeContract" class="my-4">Upgrade</base-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <base-header type="gradient-success" class=" pb-2 pb-2 pt-2 pt-md-4">
              <div class="row">
                <div class="col-xl-12"></div>
              </div>
            </base-header>
            <div class="card-body">
              <div class="row icon-examples">
                <div class="col-lg-12 col-md-4 card bg-secondary shadow border-0">
                  <div class="text-center text-muted mb-4">
                    <h3 class="mb-0">Stores Requests</h3>
                  </div>
                  <div v-if="storesRequested.length === 0" class="col-lg-12 col-md-6">
                    <h3 class="text-center text-muted mb-4">No Requests</h3>
                  </div>
                  <div v-else class="col-lg-12 col-md-6" v-for="(request, index) in storesRequested" :key="index">
                    <button
                      type="button"
                      @click=";(requestSelected = request), (showRequestModal = true)"
                      class="btn-icon-clipboard"
                    >
                      <div>
                        <span
                          ><b
                            ><h3 class="mb-0">Store Name: {{ request.name }}</h3></b
                          ></span
                        >
                      </div>
                      <div>
                        <span>Description: {{ request.description }}</span>
                      </div>
                      <div>
                        <span>Requested owner: {{ request.owner }}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <modal :show.sync="showRequestModal" body-classes="p-0" modal-classes="modal-dialog-centered modal-md">
        <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
          <template v-if="!requestAccepted">
            <div class="text-center text-muted mb-4">
              <h3 class="mb-0">Request</h3>
            </div>
            <div class="text-center text-muted mb-4">
              <div class="text-center text-muted mb-4">
                Store Name: <b>{{ requestSelected.name }}</b>
              </div>
              <div class="text-center text-muted mb-4">
                Store Description: <b>{{ requestSelected.description }}</b>
              </div>
              <div class="text-center text-muted mb-4">
                Proposed Owner: <b>{{ requestSelected.owner }}</b>
              </div>
            </div>
            <div class="text-center">
              <base-button type="primary" @click="acceptRequest" class="my-4">Accept Request</base-button>
            </div>
          </template>
          <div v-else class="text-center text-muted mb-4">
            <h3 class="mb-0">Store Created!</h3>
            <base-button
              type="primary"
              @click="
                requestAccepted = false
                showRequestModal = false
              "
              class="my-4"
              >Ok</base-button
            >
          </div>
        </card>
      </modal>
    </div>
  </div>
</template>
<script>
const web3 = require('./../web3_connection')(require('web3'))
const MultiSigWallet = require('../contracts/MultiSigWallet')(web3)
const Marketplace = require('../contracts/Marketplace')(web3)
const AdminProxy = require('../contracts/AdminProxy')(web3)

//const Marketplace = require('../contracts/Marketplace')(web3)
export default {
  data: () => ({
    admins: [],
    required: '',
    txCount: '',
    newAdmin: '',
    newImplementation: '',
    implementation: '',
    adminMultisig: '',
    storesRequested: [],
    requestAccepted: false,
    showRequestModal: false,
    requestSelected: {},
  }),
  created() {
    this.currentAddress = web3.givenProvider.selectedAddress
    this.init()
    this.getStoresRequests()
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
        this.admins = await MultiSigWallet.methods.getOwners().call()
        this.required = await MultiSigWallet.methods.required().call()
        this.txCount = await MultiSigWallet.methods.transactionCount().call()
        this.implementation = await AdminProxy.methods.implementation().call()
        this.adminMultisig = await AdminProxy.methods.admin().call()
      } catch (error) {
        console.log(error)
      }
    },
    async addNewAdmin() {
      try {
        if (this.newAdmin == undefined) {
          throw new Error('New admin address not valid')
        }
        await MultiSigWallet.methods.addOwner(this.newAdmin).send({
          from: this.currentAddress,
          gas: 300000,
        })
        this.newAdmin = ''
      } catch (error) {
        console.log(error)
      }
    },
    async getStoresRequests() {
      try {
        this.storesRequested = []
        const storesRequests = await Marketplace.methods.getStoresRequestsOwners().call()
        for (const owner of storesRequests) {
          const storeRequest = await Marketplace.methods.getStoreRequest(owner).call()
          const request = {
            name: storeRequest[0],
            description: storeRequest[1],
            owner: owner,
          }
          this.storesRequested.push(request)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async acceptRequest() {
      try {
        const encodedCall = web3.eth.abi.encodeFunctionCall(
          {
            name: 'addStore',
            type: 'function',
            inputs: [
              {
                type: 'string',
                name: '_name',
              },
              {
                type: 'string',
                name: '_description',
              },
              {
                type: 'address',
                name: '_owner',
              },
            ],
          },
          [this.requestSelected.name, this.requestSelected.description, this.requestSelected.owner],
        )

        await MultiSigWallet.methods.submitTransaction(AdminProxy._address, 0, encodedCall).send({
          from: this.currentAddress,
        })

        this.getStoresRequests()
        this.requestAccepted = true
      } catch (error) {
        console.log(error)
      }
    },
    async upgradeContract() {
      try {
        if (this.newImplementation == undefined) {
          throw new Error('New admin address not valid')
        }

        const encodedCall = web3.eth.abi.encodeFunctionCall(
          {
            name: 'upgradeTo',
            type: 'function',
            inputs: [
              {
                type: 'address',
                name: 'newImplementation',
              },
            ],
          },
          [this.newImplementation],
        )

        await MultiSigWallet.methods.submitTransaction(AdminProxy._address, 0, encodedCall).send({
          from: this.currentAddress,
        })

        this.newImplementation = ''
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
<style></style>
