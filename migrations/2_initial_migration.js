const AdminProxy = artifacts.require('./AdminUpgradeabilityProxy.sol')
const Marketplace = artifacts.require('./Marketplace.sol')
const MarketplaceV2 = artifacts.require('./test/MarketplaceV2.sol')
const Store = artifacts.require('./Store.sol')
const MultiSigWallet = artifacts.require('./MultiSigWallet.sol')
const encodeCall = require('../test/helpers/encodeCall')
const fs = require('fs')

async function init(deployer, [owner, storeOwner1, storeOwner2, storeOwner3]) {
  console.log('Initial migration of the marketplace contracts')
  // deploy MultiSig Wallet
  const multisig = await deployer.deploy(MultiSigWallet, [owner], 1)

  // deploy marketplace implementation
  const marketplaceImpl = await deployer.deploy(Marketplace)

  // deploy marketplaceV2 implementation
  await deployer.deploy(MarketplaceV2)

  const initializeData = await encodeCall('initialize', ['address'], [multisig.address])

  const proxy = await deployer.deploy(AdminProxy, marketplaceImpl.address, multisig.address, initializeData)
  const marketplace = await Marketplace.at(proxy.address)

  const deployedAddresses = {
    proxy: proxy.address,
    multisig: multisig.address,
    marketplace: marketplace.address,
  }

  const data = JSON.stringify(deployedAddresses)
  fs.writeFile('app/src/contracts/deployed_addresses.json', data, err => {
    if (err) throw err
  })

  //add stores
  const dataCreateStore1 = await encodeCall(
    'addStore',
    ['string', 'string', 'address'],
    ['Lucky Store', 'Books store', storeOwner1],
  )
  await multisig.submitTransaction(proxy.address, 0, dataCreateStore1, {
    from: owner,
  })

  const dataCreateStore2 = await encodeCall(
    'addStore',
    ['string', 'string', 'address'],
    ['Blues Store', 'Music store', storeOwner2],
  )
  await multisig.submitTransaction(proxy.address, 0, dataCreateStore2, {
    from: owner,
  })

  const stores = await marketplace.getStoresAddresses()
  const store1 = await Store.at(stores[0])

  //add products
  await store1.addProduct(
    'Solidity Book',
    'How to write solidity smart contracts',
    web3.utils.fromWei('100000000000000000', 'wei'),
    '1000',
    {
      from: storeOwner1,
    },
  )
  await store1.addProduct('Lion Book', 'Lion Story', web3.utils.fromWei('200000000000000000', 'wei'), '1500', {
    from: storeOwner1,
  })
  await store1.addProduct('Fantasy Book', 'A fantasy story', web3.utils.fromWei('150000000000000000', 'wei'), '500', {
    from: storeOwner1,
  })
}

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    await init(deployer, accounts)
  })
}
