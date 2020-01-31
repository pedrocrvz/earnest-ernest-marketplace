const AdminProxy = artifacts.require('./AdminUpgradeabilityProxy.sol')
const Marketplace = artifacts.require('./Marketplace.sol')
const Multisig = artifacts.require('./MultiSigWallet.sol')
const Store = artifacts.require('./Store.sol')

const chai = require('chai')
const {BN} = require('openzeppelin-test-helpers')
const encodeCall = require('./helpers/encodeCall')

chai.use(require('chai-shallow-deep-equal'))
const assert = chai.assert
const expect = chai.expect
let store, marketplace, multisig, productId

contract('Store', ([owner, holder1, holder2, holder3]) => {
  before('initialize contracts', async () => {
    //initialize multisig
    multisig = await Multisig.new([owner], 1)
    console.log('\t : ----------------------------------')
    console.log(`\t : Multisig at address ${multisig.address}`)
    console.log('\t : ----------------------------------\n')

    //initialize marketplace implementation
    let marketplaceImpl = await Marketplace.new()

    console.log('\t : ----------------------------------')
    console.log(`\t : Marketplace implementation at address ${marketplaceImpl.address}`)
    console.log('\t : ----------------------------------\n')

    //encode initialize call
    const initializeData = await encodeCall('initialize', ['address'], [multisig.address])
    //deploy marketplace proxy
    const marketplaceProxy = await AdminProxy.new(marketplaceImpl.address, multisig.address, initializeData)

    console.log('\t : ----------------------------------')
    console.log(`\t : Marketplace proxy at address ${marketplaceImpl.address}`)
    console.log('\t : ----------------------------------\n')

    //link proxy to marketplace
    marketplace = await Marketplace.at(marketplaceProxy.address)

    //initialize store
    store = await Store.new(marketplace.address, owner)
    console.log('\t : ----------------------------------')
    console.log(`\t : Store at address ${store.address}`)
    console.log('\t : ----------------------------------\n')
  })

  describe('Check if store setup is correct', () => {
    it('should have the correct owner address', async () => {
      const _owner = await store.owner()
      assert.equal(_owner, owner)
    })
    it('should have the correct marketplace address', async () => {
      const _marketplace = await store.marketplace()
      assert.equal(_marketplace, marketplace.address)
    })
  })

  describe('Add product to store and test getters', () => {
    it('should add a product to the store', async () => {
      const _product = await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
      productId = _product.logs[0].args._id
      assert.equal(_product.logs[0].args._name, 'test_product')
      assert.equal(_product.logs[0].args._description, 'this is a test product')
      expect(_product.logs[0].args._price).to.be.bignumber.equal(new BN(1000000000))
      expect(_product.logs[0].args._quantity).to.be.bignumber.equal(new BN(300))
    })
    it('should revert when trying to add a product by a non store owner address', async () => {
      try {
        await store.addProduct('test_product', 'this is a test product', 1000000000, 300, {from: holder1})
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should get the product id', async () => {
      const _productId = await store.getProductsIds()
      assert.equal(_productId[0], productId)
    })
    it('should get the product by id', async () => {
      const _product = await store.getProduct(productId)

      assert.equal(_product[0], 'test_product')
      assert.equal(_product[1], 'this is a test product')
      expect(_product[2]).to.be.bignumber.equal(new BN(1000000000))
      expect(_product[3]).to.be.bignumber.equal(new BN(300))
    })
    it('should revert when product does not exist', async () => {
      try {
        await store.getProduct(web3.utils.sha3('DOES_NOT_EXIST'))
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
  })

  describe('Update product', () => {
    it('should update products name', async () => {
      await store.updateProductName(productId, 'test_product_updated')
      const _product = await store.getProduct(productId)
      assert.equal(_product[0], 'test_product_updated')
    })
    it('should update products description', async () => {
      await store.updateProductDescription(productId, 'this is a test product updated')
      const _product = await store.getProduct(productId)
      assert.equal(_product[1], 'this is a test product updated')
    })
    it('should update products price', async () => {
      await store.updateProductPrice(productId, 5000000000)
      const _product = await store.getProduct(productId)
      expect(_product[2]).to.be.bignumber.equal(new BN(5000000000))
    })
    it('should update products quantity', async () => {
      await store.updateProductQuantity(productId, 500)
      const _product = await store.getProduct(productId)
      expect(_product[3]).to.be.bignumber.equal(new BN(500))
    })
  })

  describe('Buy product', () => {
    it('should buy 10 products', async () => {
      const _buy = await store.buyProduct(productId, 100, {from: holder1, value: '100000000000000'})
      assert.equal(_buy.logs[0].event, 'ProductBought')
    })
    it('should have the correct balance after purchase', async () => {
      const _balance = await store.getBalance()
      expect(_balance).to.be.bignumber.equal(new BN(500000000000))
    })
    it('should have the updated product quantity after purchase', async () => {
      const _product = await store.getProduct(productId)
      expect(_product[3]).to.be.bignumber.equal(new BN(400))
    })
  })

  describe('Delete product', () => {
    it('should delete product', async () => {
      await store.deleteProduct(productId)
      try {
        await store.getProduct(productId)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
  })
})
