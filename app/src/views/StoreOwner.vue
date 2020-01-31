<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
      <div class="row">
        <div class="col-xl-12">
          <stats-card>
            <h2 class="mb-0">{{ store.name }}</h2>
            <h4 class="mb-0">{{ store.description }}</h4>
            <template slot="footer">
              <span class="text-nowrap"> <i class="ni ni-money-coins"></i> &nbsp; {{ storeBalance }} </span>
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
                <div class="col-lg-12 col-md-6 card bg-secondary shadow border-0">
                  <form role="form">
                    <div class="text-center text-muted mb-4">
                      <h3 class="mb-0">Add New Product</h3>
                    </div>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="Product Name"
                      v-model="newProduct.name"
                    >
                    </base-input>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="Product Description"
                      v-model="newProduct.description"
                    >
                    </base-input>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="Product Price"
                      v-model="newProduct.price"
                    >
                    </base-input>
                    <base-input
                      class="input-group-alternative mb-3"
                      placeholder="Product Quantity"
                      v-model="newProduct.quantity"
                    >
                    </base-input>
                    <div class="text-center">
                      <base-button type="primary" @click="addProduct" class="my-4">Add</base-button>
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
              <div class="text-center text-muted mb-4">
                <h3 class="mb-0">Remove Product</h3>
              </div>
              <div class="row icon-examples">
                <div v-if="products.length === 0" class="col-lg-12 col-md-6">
                  <h3 class="mb-0">No Products</h3>
                </div>
                <div v-else class="col-lg-2 col-md-6" v-for="(product, index) in products" :key="index">
                  <base-button
                    type="button"
                    @click="removeProduct(product.id)"
                    class="btn-icon-clipboard"
                    data-clipboard-text="air-baloon"
                  >
                    <div>
                      <span
                        ><b>{{ product.name }}</b></span
                      >
                    </div>
                    <div>
                      <span>Price: {{ product.price }} Ether</span>
                    </div>
                    <div>
                      <span>Stock: {{ product.quantity }}</span>
                    </div>
                    <br />
                    <div>
                      <span
                        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i class="ni ni-fat-remove"></i
                      ></span>
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
              <div class="text-center text-muted mb-4">
                <h3 class="mb-0">Update Product</h3>
              </div>
              <div class="row icon-examples">
                <div v-if="products.length === 0" class="col-lg-12 col-md-6">
                  <h3 class="mb-0">No Products</h3>
                </div>
                <div v-else class="col-lg-12 col-md-6" v-for="(product, index) in products" :key="index">
                  <router-link
                    :to="{
                      name: 'update-product',
                      params: { id: product.id },
                    }"
                    class="text-light"
                  >
                    <button type="button" class="btn-icon-clipboard">
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
let Store, Marketplace
export default {
  data: () => ({
    currentAddress: '',
    storeId: '',
    storeBalance: '',
    products: [],
    store: {},
    newProduct: {},
    updateProduct: {},
    productUpdated: false,
  }),
  created() {
    this.storeId = this.$route.params.id
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
        const storeDetails = await Marketplace.methods.getStore(this.storeId).call()
        this.store = {
          id: this.storeId,
          name: storeDetails[0],
          description: storeDetails[1],
          owner: storeDetails[2],
          isBanned: storeDetails[3],
        }

        Store = require('../contracts/Store')(web3, this.storeId)

        const productsIds = await Store.methods.getProductsIds().call()
        for (const productId of productsIds) {
          const productDetails = await Store.methods.getProduct(productId).call()
          const product = {
            id: productId,
            name: productDetails[0],
            description: productDetails[1],
            price: productDetails[2],
            quantity: productDetails[3],
          }
          this.products.push(product)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async addProduct() {
      try {
        if (
          this.newProduct.name === undefined ||
          this.newProduct.description === undefined ||
          this.newProduct.price === undefined ||
          this.newProduct.quantity === undefined
        ) {
          throw new Error('Must have valid data')
        }

        await Store.methods
          .addProduct(
            this.newProduct.name,
            this.newProduct.description,
            this.newProduct.price,
            this.newProduct.quantity,
          )
          .send({
            from: this.currentAddress,
            gas: 300000,
          })
        this.newProduct = {}
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    async removeProduct(productId) {
      try {
        await Store.methods.deleteProduct(productId).send({
          from: this.currentAddress,
          gas: 500000,
        })
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
