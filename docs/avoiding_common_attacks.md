## Race Conditions

### Reentrancy and Cross-function

The use of `transfer()` is used to transfer ETH and there aren't any external calls to unknown contracts, external call only happen between our contracts, which we control the implementation. Performing internal work first and then call external contracts is done and encouraged.

## Front Running and Timestamp dependence

Order is not a big issue in this project, miners can not influence directly the outcome of execution as no function relies on order to correctly execute. The only function that may be affected by this is the `withdraw`, as if order is different the balance may be differetn, however is not a big issue because the owner can withdraw whenever he wants and only him can do it.

This project does not rely on dates or date variable that can be manipuled. Although `block.timestamp` is used, it does not affect in any way the execution. It is simply used as a timestamp to generate a random id for the products: `bytes32 _id = keccak256( abi.encodePacked(_name, _quantity, block.timestamp));`, so it's not important if the date is correct but that it provides differents inputs.

## Integer Overflow and Underflow

Use of SafeMath library avoid over/underflows in arithmetic operations.

## DoS with (Unexpected) revert & Block Gas Limit

We use pull over push to protect from this kind of attacks.

### Forcibly Sending Ether to a Contract

The project simply deals with contracts balance to withdraw the balance and on destroys. Apart from the modifier `hasBalance`, which is called on withdraws to ensure the contarct balance is bigger than zero, there aren't any requires or if statements that rely on contract balance conditions.
On the marketplace contract we dont have a payable fallback, since its not designed to receive Ether. However we have a seldestruct that implies to take as argument the receiver of the contract balance. (Never assume your contract is being deployed with a balance of 0 ether)

### Implementation Bugs

The marketplace contract is the key piece of the system and can be easily upgraded to fix bugs or implement new functions.

### Be aware of the tradeoffs between send(), transfer(), and call.value()()

As referred, only `transfer()` is used to transfer value.

### Explicitly mark visibility in functions and state variables

All function visibility is explicitly marked. Only variables that make sense are public, like `isStoreOwner`, which provides already an easy to use and useful getter.

### Lock pragmas to specific compiler version

All contract are loacked using `pragma solidity 0.5.2;`.

### Avoid using tx.origin

`tx.origin` is not used.

## Security Tools

Ran Mythril, Osiris, Oyente, Securify, Slither, Smartcheck, Solhint using [SmartBugs](https://smartbugs.github.io)

## References

https://consensys.github.io/smart-contract-best-practices/recommendations/
https://blog.sigmaprime.io/solidity-security.html
https://github.com/crytic/awesome-ethereum-security#security-references
