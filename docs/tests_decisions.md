Test are divided in 3 files and are all situated in the `tests` folder:

- Marketplace.js
- Marketplace.upgradeability.js
- Store.js

All the test are documented with a sentence describing the purpose of the test. All tests are done in javascript.

Expected output

```
  Contract: Store
         : ----------------------------------
         : Multisig at address 0x6C9C50777991379C56E145C07eB74D3a91549860
         : ----------------------------------

         : ----------------------------------
         : Marketplace implementation at address 0x31229E54eE28A34b0AA271F7662CB8Fb417ed541
         : ----------------------------------

         : ----------------------------------
         : Marketplace proxy at address 0x31229E54eE28A34b0AA271F7662CB8Fb417ed541
         : ----------------------------------

    Check if marketplace setup is correct
      ✓ should have the correct wallet address (63ms)
    Add a new store
      ✓ should revert when adding a new store and sender is not multisig (137ms)
      ✓ should add a new store via multisig and get the stores addresses (285ms)
      ✓ should get the store by addess/id (50ms)
    Request to open a new store
      ✓ should revert when adding a new store and sender is not multisig (183ms)
      ✓ should revert when adding another store request from the same owner (61ms)
      ✓ should create the requested store (299ms)
      ✓ should not have any request
    Ban store
      ✓ should revert when banning a new store and sender is not multisig (56ms)
      ✓ should ban the store via multisig (174ms)
      ✓ should revert when adding a product to the store (89ms)
      ✓ should unban the store via multisig (517ms)
      ✓ should add a product to the store (183ms)
    Pause store
      ✓ should pause store (246ms)
      ✓ should revert when adding a product to the store (144ms)
      ✓ should unpause store (176ms)
      ✓ should add a product to the store (101ms)
    Destroy store
      ✓ should revert when sender is not store owner (68ms)
      ✓ should destroy store (152ms)
      ✓ should revert when adding a product to the store (59ms)
    Destroy marketplace
      ✓ should revert when sender is not a marketplace admin (79ms)
      ✓ should destroy marketplace and return an error when getting store pause status (127ms)
      ✓ should revert when adding a product to the store

  Contract: Marketplace Upgradable
         : ----------------------------------
         : Multisig at address 0x6C9C50777991379C56E145C07eB74D3a91549860
         : ----------------------------------

         : ----------------------------------
         : Marketplace implementation at address 0x31229E54eE28A34b0AA271F7662CB8Fb417ed541
         : ----------------------------------

         : ----------------------------------
         : MarketplaceV2 implementation at address 0x68E5d85ce98b0eCCAEE6D44162eFF510765A69dC
         : ----------------------------------

         : ----------------------------------
         : Marketplace proxy at address 0x31229E54eE28A34b0AA271F7662CB8Fb417ed541
         : ----------------------------------

         : ----------------------------------
         : Store at address 0x0Bcae229a7BB433D2205895F2191D00d05d6D209
         : ----------------------------------

    Check if proxy setup is correct
      ✓ should have multisig as admin
      ✓ should have the correct implementatiom address
    Update marketplace
      ✓ should revert upgrade marketplace when sender is not multisig (38ms)
      ✓ should upgrade marketplace via multisig (121ms)
      ✓ should be ab le able to call new methods from v2 (92ms)

  Contract: Store
         : ----------------------------------
         : Multisig at address 0x6C9C50777991379C56E145C07eB74D3a91549860
         : ----------------------------------

         : ----------------------------------
         : Marketplace implementation at address 0x31229E54eE28A34b0AA271F7662CB8Fb417ed541
         : ----------------------------------

         : ----------------------------------
         : Marketplace proxy at address 0x31229E54eE28A34b0AA271F7662CB8Fb417ed541
         : ----------------------------------

         : ----------------------------------
         : Store at address 0x1D0b98e5Dd89F69f6cA7393FC1536dEa931bBA3c
         : ----------------------------------

    Check if store setup is correct
      ✓ should have the correct owner address
      ✓ should have the correct marketplace address
    Add product to store and test getters
      ✓ should add a product to the store (90ms)
      ✓ should revert when trying to add a product by a non store owner address (77ms)
      ✓ should get the product id
      ✓ should get the product by id (43ms)
      ✓ should revert when product does not exist
    Update product
      ✓ should update products name (128ms)
      ✓ should update products description (132ms)
      ✓ should update products price (111ms)
      ✓ should update products quantity (156ms)
    Buy product
      ✓ should buy 10 products (73ms)
      ✓ should have the correct balance after purchase (48ms)
      ✓ should have the updated product quantity after purchase
    Delete product
      ✓ should delete product (124ms)


  43 passing (8s)
```
