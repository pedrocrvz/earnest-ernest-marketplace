const AdminProxy = artifacts.require('./AdminUpgradeabilityProxy.sol')
const Marketplace = artifacts.require('./Marketplace.sol')
const MarketplaceV2 = artifacts.require('./test/MarketplaceV2.sol')
const Multisig = artifacts.require('./MultiSigWallet.sol')
const Store = artifacts.require('./Store.sol')

const chai = require('chai')
const {BN} = require('openzeppelin-test-helpers')
const encodeCall = require('./helpers/encodeCall')

chai.use(require('chai-shallow-deep-equal'))
const assert = chai.assert
const expect = chai.expect
let store, marketplace, multisig, marketplaceProxy, marketplaceImpl, marketplaceImplV2, marketplaceV2

contract('Marketplace Upgradable', ([owner, holder1, holder2, holder3]) => {
  before('initialize contracts', async () => {
    //initialize multisig
    multisig = await Multisig.new([owner], 1)
    console.log('\t : ----------------------------------')
    console.log(`\t : Multisig at address ${multisig.address}`)
    console.log('\t : ----------------------------------\n')

    //initialize marketplace implementation
    marketplaceImpl = await Marketplace.new()

    console.log('\t : ----------------------------------')
    console.log(`\t : Marketplace implementation at address ${marketplaceImpl.address}`)
    console.log('\t : ----------------------------------\n')

    //initialize marketplace implementation
    marketplaceImplV2 = await MarketplaceV2.new()

    console.log('\t : ----------------------------------')
    console.log(`\t : MarketplaceV2 implementation at address ${marketplaceImplV2.address}`)
    console.log('\t : ----------------------------------\n')

    //encode initialize call
    const initializeData = await encodeCall('initialize', ['address'], [multisig.address])
    //deploy marketplace proxy
    marketplaceProxy = await AdminProxy.new(marketplaceImpl.address, multisig.address, initializeData)

    console.log('\t : ----------------------------------')
    console.log(`\t : Marketplace proxy at address ${marketplaceImpl.address}`)
    console.log('\t : ----------------------------------\n')

    //link proxy to marketplace
    marketplace = await Marketplace.at(marketplaceProxy.address)
    marketplaceV2 = await MarketplaceV2.at(marketplaceProxy.address)

    //initialize store
    store = await Store.new(marketplace.address, owner)
    console.log('\t : ----------------------------------')
    console.log(`\t : Store at address ${store.address}`)
    console.log('\t : ----------------------------------\n')
  })

  describe('Check if proxy setup is correct', () => {
    it('should have multisig as admin', async () => {
      const _admin = await marketplaceProxy.admin()
      assert.equal(_admin, multisig.address)
    })
    it('should have the correct implementatiom address', async () => {
      const _impl = await marketplaceProxy.implementation()
      assert.equal(_impl, marketplaceImpl.address)
    })
  })

  describe('Update marketplace', () => {
    it('should revert upgrade marketplace when sender is not multisig', async () => {
      try {
        await marketplaceProxy.upgradeTo(marketplaceImplV2.address)
      } catch (error) {
        assert.ok(error.toString().search('revert') > 0, 'transaction reverted')
      }
    })
    it('should upgrade marketplace via multisig', async () => {
      const data = await encodeCall('upgradeTo', ['address'], [marketplaceImplV2.address])
      await multisig.submitTransaction(marketplace.address, 0, data, {
        from: owner,
      })
      const _impl = await marketplaceProxy.implementation()
      assert.equal(_impl, marketplaceImplV2.address)
    })
    it('should be ab le able to call new methods from v2', async () => {
      await marketplaceV2.setCounter(10)
      const _count = await marketplaceV2.getCounter()
      assert.equal(_count, 10)
    })
  })
})
