pragma solidity ^0.5.2;

import "../Marketplace.sol";

/** 
 * @title MarketplaceV2
 * @author Pedro Cruz
 * @dev This contract is mock to test upgradeability
 */
contract MarketplaceV2 is Marketplace {
    uint256 public counter;

    function setCounter(uint256 count) public {
        counter = count;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
