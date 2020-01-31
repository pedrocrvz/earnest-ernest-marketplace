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
let store, marketplace, multisig, storeId

contract('Store', ([owner, storeOwner1, storeOwner2, holder3]) => {
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

  describe('Check if marketplace setup is correct', () => {
    it('should have the correct wallet address', async () => {
      const _wallet = await marketplace.wallet()
      assert.equal(_wallet, multisig.address)
    })
  })

  describe('Add a new store', () => {
    it('should revert when adding a new store and sender is not multisig', async () => {
      try {
        await marketplace.addStore('Blues Store', 'Music store', storeOwner1)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should add a new store via multisig', async () => {
      const dataCreateStore = await encodeCall(
        'addStore',
        ['string', 'string', 'address'],
        ['Blues Store', 'Music store', storeOwner1],
      )
      await multisig.submitTransaction(marketplace.address, 0, dataCreateStore, {
        from: owner,
      })
    })
    it('should get the stores addresses', async () => {
      const _storesAddresses = await marketplace.getStoresAddresses()
      storeId = _storesAddresses[0]
      assert.equal(_storesAddresses.length, 1)
    })
    it('should get the store by addess/id', async () => {
      const _store = await marketplace.getStore(storeId)
      assert.equal(_store[0], 'Blues Store')
      assert.equal(_store[1], 'Music store')
      assert.equal(_store[2], storeOwner1)
      assert.equal(_store[3], false)
    })
  })

  describe('Ban store', () => {
    it('should revert when banning a new store and sender is not multisig', async () => {
      try {
        await marketplace.setBanStatus(storeId, true)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should ban the store via multisig', async () => {
      const data = await encodeCall('setBanStatus', ['address', 'bool'], [storeId, true])
      await multisig.submitTransaction(marketplace.address, 0, data, {
        from: owner,
      })
      const isBanned = await marketplace.isBanned(storeId)
      assert.equal(isBanned, true)
    })
    it('should revert when adding a product to the store', async () => {
      try {
        const _product = await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should unban the store via multisig', async () => {
      const data = await encodeCall('setBanStatus', ['address', 'bool'], [storeId, false])
      await multisig.submitTransaction(marketplace.address, 0, data, {
        from: owner,
      })
      const isBanned = await marketplace.isBanned(storeId)
      assert.equal(isBanned, false)
    })
    it('should revert when adding a product to the store', async () => {
      const _product = await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
      productId = _product.logs[0].args._id
      assert.equal(_product.logs[0].args._name, 'test_product')
      assert.equal(_product.logs[0].args._description, 'this is a test product')
      expect(_product.logs[0].args._price).to.be.bignumber.equal(new BN(1000000000))
      expect(_product.logs[0].args._quantity).to.be.bignumber.equal(new BN(300))
    })
  })
})
