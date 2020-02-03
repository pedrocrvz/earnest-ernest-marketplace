<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-xl-10">
          <stats-card>
            <b>Total sales: {{ salesBalance }} ETH</b>

            <div>
              <b>Marketplace Status: </b> <span v-if="isPaused" class="text-nowrap">PAUSED</span>
              <span v-else class="text-left">NOT PAUSED</span>
            </div>
            <template slot="footer">
              <span class="text-nowrap">Marketplace Details</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-2">
          <stats-card>
            <base-button type="primary" @click="pauseMarketplace" v-if="!isPaused" class="sm"
              >Pause Marketplace</base-button
            >
            <base-button type="primary" @click="unpauseMarketplace" v-else class="sm">Unpause Marketplace</base-button>
            <template slot="footer">
              <center>
                <span>Circuit Breaker</span>
              </center>
            </template>
          </stats-card>
        </div>
      </div>
      <base-header type="gradient-success" class=" pb-2 pb-2 pt-2 pt-md-4">
        <div class="row">
          <div class="col-xl-12"></div>
        </div>
      </base-header>
      <div class="row">
        <div class="col-xl-6">
          <stats-card>
            <b>Implementation Address: </b>
            <template slot="footer">
              <span class="text-nowrap">{{ implementation }}</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-6">
          <stats-card>
            <b>MultiSigWallet Address: </b>
            <template slot="footer">
              <span class="text-nowrap">{{ adminMultisig }}</span>
            </template>
          </stats-card>
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
              <h3 class="mb-0">Marketplace Admin Features</h3>
            </div>
            <div class="card-body">
              <div class="row icon-examples">
                <div v-if="stores.length === 0" class="col-lg-12 col-md-6">
                  <h3 class="mb-0">No Stores</h3>
                </div>
                <div v-else class="col-lg-12 col-md-6" v-for="(store, index) in stores" :key="index">
                  <base-button
                    type="button"
                    :title="store.name"
                    class="btn-icon-clipboard"
                    data-clipboard-text="air-baloon"
                    @click=";(storeSelected = store), (showStoreModal = true)"
                  >
                    <div>
                      <span
                        ><b>{{ store.name }}</b></span
                      >
                    </div>
                    <div>
                      <span>{{ store.description }}</span>
                    </div>
                  </base-button>
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
                  <div class="text-center">
                    <base-button type="danger" @click="destroy" class="my-4">Destroy Marketplace</base-button>
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
              <base-button type="primary" @click="acceptRequest" class="my-4">Accept</base-button>
              <base-button type="primary" @click="rejectRequest" class="my-4">Reject</base-button>
            </div>
          </template>
          <div v-else class="text-center text-muted mb-4">
            <h3 class="mb-0">Request reject!</h3>
            <base-button
              type="primary"
              @click="
                requestRejected = false
                showRequestModal = false
              "
              class="my-4"
              >Ok</base-button
            >
          </div>
        </card>
      </modal>
    </div>
    <div class="col-md-4">
      <modal :show.sync="showStoreModal" body-classes="p-0" modal-classes="modal-dialog-centered modal-lg">
        <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
          <template v-if="!storeUpdated">
            <div class="text-center text-muted mb-4">
              <h3 class="mb-0">Store</h3>
            </div>
            <div class="text-center text-muted mb-4">
              <div class="text-center text-muted mb-4">
                Store Name: <b>{{ storeSelected.name }}</b>
              </div>
              <div class="text-center text-muted mb-4">
                Store Description: <b>{{ storeSelected.description }}</b>
              </div>
              <div class="text-center text-muted mb-4">
                Owner: <b>{{ storeSelected.owner }}</b>
              </div>
              <div class="text-center text-muted mb-4">
                Store banned: <b>{{ storeSelected.isBanned }}</b>
              </div>
            </div>
            <div class="text-center">
              <base-button type="primary" v-if="storeSelected.isBanned" @click="setBanStatus" class="my-4"
                >Unban Store</base-button
              >
              <base-button type="primary" v-if="!storeSelected.isBanned" @click="setBanStatus" class="my-4"
                >Ban Store</base-button
              >
              <base-button type="primary" @click="removeStore" class="my-4">Remove Store</base-button>
            </div>
          </template>
          <div v-else class="text-center text-muted mb-4">
            <h3 class="mb-0">Store updated/removed!</h3>
            <base-button
              type="primary"
              @click="
                storeUpdated = false
                showStoreModal = false
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
    requestRejected: false,
    showRequestModal: false,
    storeUpdated: false,
    showStoreModal: false,
    requestSelected: {},
    storeSelected: {},
    stores: [],
    isPaused: false,
    salesBalance: 0,
  }),
  created() {
    this.currentAddress = web3.givenProvider.selectedAddress
    this.init()
    this.getStores()
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
        this.isPaused = await Marketplace.methods.paused().call()
      } catch (error) {
        console.log(error)
      }
    },
    async getStores() {
      this.stores = []
      const storesAddresses = await Marketplace.methods.getStoresAddresses().call()
      for (const address of storesAddresses) {
        this.salesBalance += parseInt(web3.utils.fromWei(await web3.eth.getBalance(address), 'ether'))
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
    async pauseMarketplace() {
      try {
        const encodedCall = web3.eth.abi.encodeFunctionCall(
          {
            name: 'pause',
            type: 'function',
            inputs: [],
          },
          [],
        )

        await MultiSigWallet.methods.submitTransaction(AdminProxy._address, 0, encodedCall).send({
          from: this.currentAddress,
        })
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    async unpauseMarketplace() {
      try {
        const encodedCall = web3.eth.abi.encodeFunctionCall(
          {
            name: 'unpause',
            type: 'function',
            inputs: [],
          },
          [],
        )

        await MultiSigWallet.methods.submitTransaction(AdminProxy._address, 0, encodedCall).send({
          from: this.currentAddress,
        })
        this.init()
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
        })
        this.newAdmin = ''
      } catch (error) {
        console.log(error)
      }
    },
    async destroy() {
      try {
        const encodedCall = web3.eth.abi.encodeFunctionCall(
          {
            name: 'destroy',
            type: 'function',
            inputs: [
              {
                type: 'address',
                name: '_receiver',
              },
            ],
          },
          [this.currentAddress],
        )

        await MultiSigWallet.methods.submitTransaction(AdminProxy._address, 0, encodedCall).send({
          from: this.currentAddress,
        })
        this.init()
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
    async setBanStatus() {
      try {
        const encodedCall = web3.eth.abi.encodeFunctionCall(
          {
            name: 'setBanStatus',
            type: 'function',
            inputs: [
              {
                type: 'address',
                name: '_id',
              },
              {
                type: 'bool',
                name: '_status',
              },
            ],
          },
          [this.storeSelected.id, !this.storeSelected.isBanned],
        )

        await MultiSigWallet.methods.submitTransaction(AdminProxy._address, 0, encodedCall).send({
          from: this.currentAddress,
        })

        this.getStores()
        this.storeUpdated = true
      } catch (error) {
        console.log(error)
      }
    },
    async removeStore() {
      try {
        const encodedCall = web3.eth.abi.encodeFunctionCall(
          {
            name: 'removeStore',
            type: 'function',
            inputs: [
              {
                type: 'address',
                name: '_id',
              },
            ],
          },
          [this.storeSelected.id],
        )

        await MultiSigWallet.methods.submitTransaction(AdminProxy._address, 0, encodedCall).send({
          from: this.currentAddress,
        })

        this.getStores()
        this.storeUpdated = true
      } catch (error) {
        console.log(error)
      }
    },
    async rejectRequest() {
      try {
        const encodedCall = web3.eth.abi.encodeFunctionCall(
          {
            name: 'removeStoreRequest',
            type: 'function',
            inputs: [
              {
                type: 'address',
                name: '_owner',
              },
            ],
          },
          [this.requestSelected.owner],
        )

        await MultiSigWallet.methods.submitTransaction(AdminProxy._address, 0, encodedCall).send({
          from: this.currentAddress,
        })

        this.getStoresRequests()
        this.requestRejected = true
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
