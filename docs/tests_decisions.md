Test are divided in 3 files and are all situated in the `tests` folder:

- Marketplace.js
- Marketplace.upgradeability.js
- Store.js

All the test are documented with a sentenc describing the purpose of the test. All tests are done in javascript.

Expected output

```
  Contract: Store
         : ----------------------------------
         : Multisig at address 0x72389923310f84769c1efc83C4a29301c3BbbdAb
         : ----------------------------------

         : ----------------------------------
         : Marketplace implementation at address 0xF7f2bB723295ABC9a72e34381cA2b4e502ED0454
         : ----------------------------------

         : ----------------------------------
         : Marketplace proxy at address 0xF7f2bB723295ABC9a72e34381cA2b4e502ED0454
         : ----------------------------------

    Check if marketplace setup is correct
      ✓ should have the correct wallet address
    Add a new store
      ✓ should revert when adding a new store and sender is not multisig (92ms)
      ✓ should add a new store via multisig (145ms)
      ✓ should get the stores addresses (66ms)
      ✓ should get the store by addess/id (42ms)
    Request to open a new store
      ✓ should revert when adding a new store and sender is not multisig (133ms)
      ✓ should revert when adding another store request from the same owner (68ms)
      ✓ should create the requested store (288ms)
      ✓ should not have any request (44ms)
    Ban store
      ✓ should revert when banning a new store and sender is not multisig (56ms)
      ✓ should ban the store via multisig (153ms)
      ✓ should revert when adding a product to the store (85ms)
      ✓ should unban the store via multisig (187ms)
      ✓ should add a product to the store (95ms)
    Pause store
      ✓ should pause store (155ms)
      ✓ should revert when adding a product to the store (107ms)
      ✓ should unpause store (145ms)
      ✓ should add a product to the store (97ms)
    Destroy store
      ✓ should revert when sender is not store owner (69ms)
      ✓ should destroy store (124ms)
      ✓ should revert when adding a product to the store
    Destroy marketplace
      ✓ should revert when sender is not a marketplace admin (76ms)
      ✓ should destroy marketplace (82ms)
      ✓ should return an error when getting store pause status
      ✓ should revert when adding a product to the store

  Contract: Marketplace Upgradable
         : ----------------------------------
         : Multisig at address 0x72389923310f84769c1efc83C4a29301c3BbbdAb
         : ----------------------------------

         : ----------------------------------
         : Marketplace implementation at address 0xF7f2bB723295ABC9a72e34381cA2b4e502ED0454
         : ----------------------------------

         : ----------------------------------
         : MarketplaceV2 implementation at address 0x651cc2A7EEC112A2747584c05d8Eb109E8d68E2C
         : ----------------------------------

         : ----------------------------------
         : Marketplace proxy at address 0xF7f2bB723295ABC9a72e34381cA2b4e502ED0454
         : ----------------------------------

         : ----------------------------------
         : Store at address 0xb68861BD8d9566ba253D78A3525BCF9f97af3961
         : ----------------------------------

    Check if proxy setup is correct
      ✓ should have multisig as admin
      ✓ should have the correct implementatiom address
    Update marketplace
      ✓ should revert upgrade marketplace when sender is not multisig (52ms)
      ✓ should upgrade marketplace via multisig (121ms)
      ✓ should have the implementatiom address updated (77ms)
      ✓ should be ab le able to call new methods from v2 (133ms)

  Contract: Store
         : ----------------------------------
         : Multisig at address 0x72389923310f84769c1efc83C4a29301c3BbbdAb
         : ----------------------------------

         : ----------------------------------
         : Marketplace implementation at address 0xF7f2bB723295ABC9a72e34381cA2b4e502ED0454
         : ----------------------------------

         : ----------------------------------
         : Marketplace proxy at address 0xF7f2bB723295ABC9a72e34381cA2b4e502ED0454
         : ----------------------------------

         : ----------------------------------
         : Store at address 0x0A5efEc6c2DD66eB23565bC9f46cDE221d63fCdf
         : ----------------------------------

    Check if store setup is correct
      ✓ should have the correct owner address (60ms)
      ✓ should have the correct marketplace address
    Add product to store and test getters
      ✓ should add a product to the store (142ms)
      ✓ should revert when trying to add a product by a non store owner address (96ms)
      ✓ should get the product id
      ✓ should get the product by id (47ms)
      ✓ should revert when product does not exist
    Update product
      ✓ should update products name (186ms)
      ✓ should update products description (157ms)
      ✓ should update products price (142ms)
      ✓ should update products quantity (183ms)
    Buy product
      ✓ should buy 10 products (93ms)
      ✓ should have the correct balance after purchase (57ms)
      ✓ should have the updated product quantity after purchase (43ms)
    Delete product
      ✓ should delete product (155ms)
```
