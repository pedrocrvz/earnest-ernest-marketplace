<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
      <div class="row">
        <div class="col-xl-12">
          <stats-card>
            <h2 class="mb-0">{{ store.name }}</h2>
            <h4 class="mb-0">{{ store.description }}</h4>
          </stats-card>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="card-header bg-transparent">
              <h3 class="mb-0">Products</h3>
            </div>
            <div class="card-body">
              <div class="row icon-examples">
                <div v-if="products.length === 0" class="col-lg-12 col-md-6">
                  <h3 class="mb-0">No Products</h3>
                </div>
                <div v-else class="col-lg-12 col-md-6" v-for="(product, index) in products" :key="index">
                  <button
                    type="button"
                    @click=";(showProductModal = true), (productSelected = product)"
                    class="btn-icon-clipboard"
                  >
                    <div>
                      <i :class="product.name"></i>
                      <span
                        ><b
                          ><h3 class="mb-0">{{ product.name }}</h3></b
                        ></span
                      >
                    </div>
                    <div>
                      <span>Description: {{ product.description }}</span>
                    </div>
                    <div>
                      <span>Price: {{ product.price }} Ether</span>
                      <span>Stock: {{ product.quantity }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <modal :show.sync="showProductModal" body-classes="p-0" modal-classes="modal-dialog-centered modal-sm">
        <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
          <template v-if="!bougth">
            <div class="text-center text-muted mb-4">
              {{ productSelected.name }}
            </div>
            <div class="text-center text-muted mb-4">
              <span
                ><small>Price: {{ productSelected.price }} Ether</small></span
              >
              <br />
              <span
                ><small>Stock: {{ productSelected.quantity }}</small></span
              >
            </div>
            <form role="form">
              <div class="text-center text-muted mb-4">
                <h3 class="mb-0">Quantity</h3>
              </div>
              <base-input
                class="input-group-alternative mb-3"
                placeholder="Quantity You Want To Buy"
                v-model="quantity"
              >
              </base-input>
              <div class="text-center">
                <base-button type="primary" @click="buyProduct" class="my-4">Buy</base-button>
              </div>
            </form>
          </template>
          <div v-else class="text-center text-muted mb-4">
            <h3 class="mb-0">Product Bought!</h3>
            <base-button
              type="primary"
              @click="
                bougth = false
                showProductModal = false
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
let Store, Marketplace
export default {
  data: () => ({
    productSelected: {},
    showProductModal: false,
    bougth: false,
    currentAddress: '',
    products: [],
    quantity: '',
    store: {},
  }),
  created() {
    this.storeAddress = this.$route.params.id
    this.currentAddress = web3.givenProvider.selectedAddress
    Store = require('../contracts/Store')(web3, this.storeAddress)
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
        this.products = []
        const storeDetails = await Marketplace.methods.getStore(this.storeAddress).call()
        this.store = {
          name: storeDetails[0],
          description: storeDetails[1],
          owner: storeDetails[2],
          isBanned: storeDetails[3],
        }

        const productsIds = await Store.methods.getProductsIds().call()
        for (const productId of productsIds) {
          const productDetails = await Store.methods.getProduct(productId).call()
          const product = {
            id: productId,
            name: productDetails[0],
            description: productDetails[1],
            price: web3.utils.fromWei(productDetails[2], 'ether'),
            priceInWei: productDetails[2],
            quantity: productDetails[3],
          }
          this.products.push(product)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async buyProduct() {
      try {
        if (this.quantity === '' || isNaN(this.quantity)) {
          throw new Error('Quantity should be a number.')
        }

        if (parseInt(this.quantity) > parseInt(this.productSelected.quantity)) {
          throw new Error('No stock!')
        }

        const total = parseFloat(this.productSelected.priceInWei) * parseInt(this.quantity)

        await Store.methods.buyProduct(this.productSelected.id, this.quantity).send({
          value: web3.utils.fromWei(total.toString(), 'wei'),
          from: this.currentAddress,
        })

        this.bougth = true
        this.quantity = ''
        this.productSelected = {}
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
