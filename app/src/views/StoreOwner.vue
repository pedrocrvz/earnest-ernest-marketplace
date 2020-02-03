<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <!-- Card stats -->
      <div class="row">
        <div class="col-xl-8">
          <stats-card>
            <h2 class="mb-0">{{ store.name }}</h2>
            <h4 class="mb-0">{{ store.description }}</h4>
            <template slot="footer">
              <span class="text-nowrap">Store </span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-4">
          <stats-card>
            <h2 class="mb-0">Balance: {{ storeBalance }} ETH</h2>
            <h4 class="mb-0">{{ store.description }}</h4>
            <template slot="footer">
              <base-button size="sm" type="primary" @click="withdraw">Withdraw</base-button>
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
              <h3 class="mb-0">Store Admin Features</h3>
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
                  <button
                    @click=";(productId = product.id), (productToUpdate = product), (showUpdateProductModal = true)"
                    type="button"
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
            <div class="card-body">
              <div class="row icon-examples">
                <div class="col-lg-12 col-md-4 card bg-secondary shadow border-0">
                  <div class="text-center">
                    <base-button type="danger" @click="destroy" class="my-4">Destroy Store</base-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <modal :show.sync="showUpdateProductModal" body-classes="p-0" modal-classes="modal-dialog-centered modal-sm">
        <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
          <template v-if="!productUpdated">
            <div class="text-center text-muted mb-4">
              <h2 class="mb-0">Update Product</h2>
              <h3 class="mb-0">You can update only one field</h3>
            </div>

            <form role="form" v-if="!productUpdated">
              <div class="text-center text-muted mb-4">
                {{ productToUpdate.name }}
              </div>
              <base-input class="input-group-alternative mb-3" placeholder="Product Name" v-model="updateProduct.name">
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
          </template>
          <div v-else class="text-center text-muted mb-4">
            <h3 class="mb-0">Product Updated!</h3>
            <base-button
              type="primary"
              @click="
                productUpdated = false
                showUpdateProductModal = false
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
    currentAddress: '',
    storeId: '',
    productId: '',
    storeBalance: '',
    productToUpdate: {},
    products: [],
    store: {},
    newProduct: {},
    updateProduct: {},
    productUpdated: false,
    showUpdateProductModal: false,
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

        this.storeBalance = web3.utils.fromWei(await web3.eth.getBalance(this.storeId), 'ether')
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
        })
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    async withdraw() {
      try {
        await Store.methods.withdraw().send({
          from: this.currentAddress,
        })
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    async destroy() {
      try {
        await Store.methods.destroy().send({
          from: this.currentAddress,
        })
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    async updateProductDetails() {
      try {
        if (this.updateProduct.name !== undefined) {
          await Store.methods.updateProductName(this.productId, this.updateProduct.name).send({
            from: this.currentAddress,
          })
          this.productUpdated = true
        }
        if (this.updateProduct.description !== undefined) {
          await Store.methods.updateProductDescription(this.productId, this.updateProduct.description).send({
            from: this.currentAddress,
          })
          this.productUpdated = true
        }
        if (this.updateProduct.quantity !== undefined) {
          await Store.methods.updateProductQuantity(this.productId, this.updateProduct.quantity).send({
            from: this.currentAddress,
          })
          this.productUpdated = true
        }
        if (this.updateProduct.price !== undefined) {
          await Store.methods.updateProductPrice(this.productId, this.updateProduct.price).send({
            from: this.currentAddress,
          })
          this.productUpdated = true
        }

        this.updateProduct = {}
        this.productToUpdate = {}

        this.init()
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
