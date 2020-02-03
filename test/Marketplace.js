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
        await marketplace.addStore('Blues Store', 'Music store', owner)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should add a new store via multisig and get the stores addresses', async () => {
      const dataCreateStore = await encodeCall(
        'addStore',
        ['string', 'string', 'address'],
        ['Blues Store', 'Music store', owner],
      )
      await multisig.submitTransaction(marketplace.address, 0, dataCreateStore, {
        from: owner,
      })
      const _storesAddresses = await marketplace.getStoresAddresses()
      storeId = _storesAddresses[0]
      //initialize store
      store = await Store.at(storeId)
      assert.equal(_storesAddresses.length, 1)
    })
    it('should get the store by addess/id', async () => {
      const _store = await marketplace.getStore(storeId)
      assert.equal(_store[0], 'Blues Store')
      assert.equal(_store[1], 'Music store')
      assert.equal(_store[2], owner)
      assert.equal(_store[3], false)
    })
  })

  describe('Request to open a new store', () => {
    it('should revert when adding a new store and sender is not multisig', async () => {
        await marketplace.requestNewStore('Yeam Store', 'Paper store', storeOwner1)
        const _request = await marketplace.getStoreRequest(storeOwner1)
        assert.equal(_request[0], 'Yeam Store')
        assert.equal(_request[1], 'Paper store')
    })
    it('should revert when adding another store request from the same owner', async () => {
      try {
        await marketplace.requestNewStore('Yeam Store', 'Paper store', storeOwner1)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should create the requested store', async () => {
      const _storesBefore = await marketplace.getStoresAddresses()
      const dataCreateStore = await encodeCall(
        'addStore',
        ['string', 'string', 'address'],
        ['Yeam Store', 'Paper store', storeOwner1],
      )
      await multisig.submitTransaction(marketplace.address, 0, dataCreateStore, {
        from: owner,
      })
      const _storesAfter = await marketplace.getStoresAddresses()
      assert.isTrue(_storesAfter.length > _storesBefore.length)
    })
    it('should not have any request', async () => {
      const _request = await marketplace.getStoreRequest(storeOwner1)
        assert.equal(_request[0], '')
        assert.equal(_request[1], '')
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
        await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
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
    it('should add a product to the store', async () => {
      const _product = await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
      productId = _product.logs[0].args.id
      assert.equal(_product.logs[0].args.name, 'test_product')
      assert.equal(_product.logs[0].args.description, 'this is a test product')
      expect(_product.logs[0].args.price).to.be.bignumber.equal(new BN(1000000000))
      expect(_product.logs[0].args.quantity).to.be.bignumber.equal(new BN(300))
    })
  })

  describe('Pause store', () => {
    it('should pause store', async () => {
      const dataCreateStore = await encodeCall(
        'pause',
        [],
        [],
      )
      await multisig.submitTransaction(marketplace.address, 0, dataCreateStore, {
        from: owner,
      })
      const _paused = await marketplace.paused()
      assert.isTrue(_paused)
    })
    it('should revert when adding a product to the store', async () => {
      try {
        await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should unpause store', async () => {
      const dataCreateStore = await encodeCall(
        'unpause',
        [],
        [],
      )
      await multisig.submitTransaction(marketplace.address, 0, dataCreateStore, {
        from: owner,
      })
      const _paused = await marketplace.paused()
      assert.isTrue(!_paused)
    })
    it('should add a product to the store', async () => {
      const _product = await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
      productId = _product.logs[0].args.id
      assert.equal(_product.logs[0].args.name, 'test_product')
      assert.equal(_product.logs[0].args.description, 'this is a test product')
      expect(_product.logs[0].args.price).to.be.bignumber.equal(new BN(1000000000))
      expect(_product.logs[0].args.quantity).to.be.bignumber.equal(new BN(300))
    })
  })

  describe('Destroy store', () => {
    it('should revert when sender is not store owner', async () => {
      try {
        await store.destroy({ from:storeOwner1 })
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should destroy store', async () => {
      await store.destroy()
    })
    it('should revert when adding a product to the store', async () => {
      try {
        await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
  })

  describe('Destroy marketplace', () => {
    it('should revert when sender is not a marketplace admin', async () => {
      try {
        await marketplace.destroy(multisig.address)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should destroy marketplace and return an error when getting store pause status', async () => {
      const dataCreateStore = await encodeCall(
        'destroy',
        ['address'],
        [multisig.address],
      )
      await multisig.submitTransaction(marketplace.address, 0, dataCreateStore, {
        from: owner,
      })
      try {
        await marketplace.paused()
      } catch (error) {
        assert.ok(error.toString().search('Out of Gas') > 0, 'transaction reverted')
      }
    })
    it('should revert when adding a product to the store', async () => {
      try {
        await store.addProduct('test_product', 'this is a test product', 1000000000, 300)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
  })


})
