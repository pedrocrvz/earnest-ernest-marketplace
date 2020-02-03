## Upgradeability

In this project it's used the Unstructured Storage pattern for upgradeability. It's the pattern used by ZeppelinOS and it's well tested and easy to use and implement using the open zeppelin contracts as base. The ZeppelinOS was not used directly, instead I chose to use the contracts directly and make a few tweaks for better usability in this project. For example, I chose to let the admin and implementation be public to ease and simplify gathering info.

There are some requirements to use this pattern and we should be aware of them. For example constructors can not be used (we replace them by initializer funtions that can only be called once), storage layout must be taken in consideration when upgrading and we must use specific open zeppelin library contracts. For detailed info please visit https://blog.openzeppelin.com/upgradeability-using-unstructured-storage/

## Fail Early and Fail Loud

Conditions are checked as early as possible (prefered use `require()` over `if`) and exceptions are thrown if conditions are not met. Use of modifiers is heavily used.
Modifiers that use `require()`: - Marketplace.sol: `onlyWallet`, `onlyStoreRemoval`, `notNull` and `requestOwnerDoesNotExist`; - Store.sol: `refund`, `productExists`, `whenNotPaused`, `notBanned`, `hasStock`, `hasBalance`, `onlyMarketplaceOrOwner` and `onlyOwner`;

## Restricting Access

The Marketplace is controled by a multisig wallet. I chose to use Gnosis MultiSigWallet because it's a battle tested implementation and already seen as standard in the industry. So, the owner of the multisig are the admins of the marketplace. To ease demonstration and testing the number of required confirmations is initially set to one and there is only one owner (one admin). The requirements can easily be updated and new admins added. The multisig can add/remove/ban stores. The modifier `onlyWallet` restricts calls/execution when `msg.sender` is th multisig wallet. Consensus on operations by admins is resolved in the multisig.

A Store is controlled by an owner and can only perform write operation if it is not banned. The modifier `onlyOwner` is used to make sure the `msg.sender` is the owner on protected functions.

## Mortal

To destroy a store or the marketplace, both contracts implement a function called `destroy()`. When `destroy()` is called on the marketplace, all the stores are destroyed, transfering the funds to the owner, and the marketplace is destroyed also. So the marketplace can destroy stores and the function can only be called by the multisig. When `destroy()` is called on the store it simplies destroys the store and transfers the funds to the owner. Can only be called by the owner.

## Pull over Push Payments

This pattern is used in store's `withdraw()`. When a owner calls withdraw all the store balance is transfered to him/her.

## Circuit Breaker

The marketplace contract inherits zeppelin's `Pausable` contracts, and so we make use of the functions implemented there to allow to pause/unpause the marketplace. Only the multisig can pause/unpause the contract. The modifier `whenNotPaused` is used to check if the marketplace is paused or no.

The store contract doesn't have itself a mechanism that allows the owner to pause it, but has a modifier `whenNotPaused` to check if the marketplace is paused, and if so, throws an exception. The contract store also has a modifier `notBanned` that checks if the store is currently banned by calling the marketplace contract. The store must not be banned to sell/add/update products, otherwise a exception is trown. So, only the marketplace has the ability to pause itself and in consequent pause the store, or simply ban a store to individually pause it.
