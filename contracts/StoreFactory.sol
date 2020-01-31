pragma solidity ^0.5.2;

import "./Store.sol";

/** 
 * @title StoreFactory 
 * @author Pedro Cruz
 * @dev This contract allows the creation of new stores
 */
contract StoreFactory {
    /**
     * @dev Allows to ddeploys new store
     * @param _owner The owner of the store
     * @return Returns the address of the new store created
     */
    function deployStore(address payable _owner) internal returns (address) {
        Store store = new Store(address(this), _owner);
        return address(store);
    }
}
