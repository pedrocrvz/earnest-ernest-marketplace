<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
      <div class="row">
        <div class="col-xl-12">
          <stats-card>
            <h2 class="mb-0">{{ product.name }}</h2>
            <h4 class="mb-0">{{ product.description }}</h4>

            <template slot="footer">
              <span class="text-nowrap"> {{ product.price }} ETH Per Unit</span>
            </template>
          </stats-card>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="card-body">
              <div class="row icon-examples">
                <div class="col-lg-12 col-md-4 card bg-secondary shadow border-0">
                  <form role="form" v-if="!productUpdated">
                    <div class="text-center text-muted mb-4">
                      <h3 class="mb-0">Update Product - You can update only one field</h3>
                    </div>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="Product Name"
                      v-model="updateProduct.name"
                    >
                    </base-input>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="Product Description"
                      v-model="updateProduct.description"
                    >
                    </base-input>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="Product Price"
                      v-model="updateProduct.price"
                    >
                    </base-input>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="Product Quantity"
                      v-model="updateProduct.quantity"
                    >
                    </base-input>
                    <div class="text-center">
                      <base-button type="primary" @click="updateProductDetails" class="my-4">Update</base-button>
                    </div>
                  </form>
                  <div v-else class="text-center text-muted mb-4">
                    <h3 class="mb-0">Product Updated</h3>
                    <base-button type="primary" @click="productUpdated = false" class="my-4">Ok</base-button>
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
let Store, Marketplace
export default {
  data: () => ({
    currentAddress: '',
    quantity: '',
    product: {},
    updateProduct: {},
    productUpdated: false,
  }),
  created() {
    this.productId = this.$route.params.id
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
        this.products = []
        this.storeId = await Marketplace.methods.storesByOwner(this.currentAddress).call()

        const storeDetails = await Marketplace.methods.getStore(this.storeId).call()
        this.store = {
          id: this.storeId,
          name: storeDetails[0],
          description: storeDetails[1],
          owner: storeDetails[2],
          isBanned: storeDetails[3],
        }

        Store = require('../contracts/Store')(web3, this.storeId)

        const productDetails = await Store.methods.getProduct(this.productId).call()
        this.product = {
          name: productDetails[0],
          description: productDetails[1],
          price: web3.utils.fromWei(productDetails[2], 'ether'),
          priceInWei: productDetails[2],
          quantity: productDetails[3],
        }
      } catch (error) {
        console.log(error)
      }
    },
    async updateProductDetails() {
      try {
        if (this.updateProduct.name !== undefined) {
          await Store.methods.updateProductName(this.productId, this.updateProduct.name).send({
            from: this.currentAddress,
            gas: 300000,
          })
        }
        if (this.updateProduct.description !== undefined) {
          await Store.methods.updateProductDescription(this.productId, this.updateProduct.description).send({
            from: this.currentAddress,
            gas: 300000,
          })
        }
        if (this.updateProduct.quantity !== undefined) {
          await Store.methods.updateProductQuantity(this.productId, this.updateProduct.quantity).send({
            from: this.currentAddress,
            gas: 300000,
          })
        }
        if (this.updateProduct.price !== undefined) {
          await Store.methods.updateProductPrice(this.productId, this.updateProduct.price).send({
            from: this.currentAddress,
            gas: 300000,
          })
        }

        this.updateProduct = {}
        this.productUpdated = true
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
