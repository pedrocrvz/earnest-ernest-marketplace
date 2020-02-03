pragma solidity 0.5.2;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/lifecycle/Pausable.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./StoreFactory.sol";

/** 
 * @title Marketplace 
 * @author Pedro Cruz
 * @dev This contract is the marketplace. 
 * It allows to add, ban or remove stores and is controlled by a multisig wallet.
 * It is upgradeable and pausable.
 */
contract Marketplace is Initializable, Pausable, StoreFactory {
    using SafeMath for uint256;

    /*
     *  Events
     */
    event StoreOwnerAdded(address storeOwnerAddress);
    event StoreOwnerRemoved(address storeOwnerAddress);
    event StoreCreated(address id, string name, address owner);
    event StoreRequested(string name, address owner);
    event StoreRemoved(address id);
    event MarketplaceDestroyed(address marketplace, address receiver);

    /*
     *  Storage
     */
    address public wallet;
    address[] private storesAddresses;

    mapping(address => StoreDetails) private stores;
    mapping(address => address[]) private storesByOwner;
    mapping(address => bool) public isStoreOwner;
    mapping(address => bool) public isStore;

    mapping(address => StoreRequest) private storesRequests;
    address[] private storesRequestsOwners;

    struct StoreDetails {
        // store address serves as id
        address id;
        string name;
        string description;
        address payable owner;
        bool isBanned;
    }

    struct StoreRequest {
        string name;
        string description;
        address owner;
        bool exists;
    }

    /*
     *  Modifiers
     */
    modifier onlyWallet() {
        require(wallet == msg.sender, "Caller is not MultiSig wallet");
        _;
    }

    modifier onlyStoreRemoval(address _id) {
        require(isStore[msg.sender]);
        require(msg.sender == _id);
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0));
        _;
    }

    modifier requestOwnerDoesNotExist(address _owner) {
        require(!storesRequests[_owner].exists);
        _;
    }

    /**
     * @dev Replaces constructor. Called on deployment
     * @param _wallet The multisig wallet
     */
    function initialize(address _wallet) public initializer {
        Pausable.initialize(_wallet);
        wallet = _wallet;
    }

    /*
     *  Public functions
     */

    /**
    * @dev Allows to request the adition of a new store
    * @param _name Name of the store
    * @param _description Description of the store
    * @param _owner Owner of the new store
    */
    function requestNewStore(
        string memory _name,
        string memory _description,
        address _owner
    ) public notNull(_owner) whenNotPaused {
        StoreRequest memory _request = StoreRequest(
            _name,
            _description,
            _owner,
            true
        );
        storesRequestsOwners.push(_owner);
        storesRequests[_owner] = _request;
        emit StoreRequested(_request.name, _request.owner);
    }

    /**
    * @dev Allows to remove a request of a new store
    * @param _owner Owner of the new store
    */
    function removeStoreRequest(address _owner)
        public
        onlyWallet
        whenNotPaused
    {
        delete storesRequests[_owner];
        for (uint256 i = 0; i < storesRequestsOwners.length.sub(1); i++) {
            if (storesRequestsOwners[i] == _owner) {
                storesRequestsOwners[i] = storesRequestsOwners[storesRequestsOwners
                    .length
                    .sub(1)];
                break;
            }
        }
        storesRequestsOwners.length = storesRequestsOwners.length.sub(1);
    }

    /**
    * @dev Allows to add an store. Transaction can only be performed by multisig wallet and the owner address can not have more than one store
    * @param _name Name of the store
    * @param _description Description of the store
    * @param _owner Owner of the new store
    * @return _id Returns the address of the store created
    */
    function addStore(
        string memory _name,
        string memory _description,
        address payable _owner
    ) public onlyWallet notNull(_owner) whenNotPaused {
        address _id = deployStore(_owner);

        StoreDetails memory _storeDetails = StoreDetails(
            _id,
            _name,
            _description,
            _owner,
            false
        );

        addStoreOwner(_owner);
        isStore[_id] = true;
        storesByOwner[_owner].push(_id);
        stores[_id] = _storeDetails;
        storesAddresses.push(_id);

        if (storesRequests[_owner].exists) {
            removeStoreRequest(_owner);
        }

        emit StoreCreated(
            _storeDetails.id,
            _storeDetails.name,
            _storeDetails.owner
        );

    }

    /**
     * @dev Allows to remove a store details and destroy it
     * @param _id The address of the store to be removed
     */
    function removeStore(address payable _id) public onlyWallet whenNotPaused {
        Store _storeContract = Store(_id);
        _storeContract.destroy();
    }

    /**
     * @dev Allows to remove store details
     * @param _id The address of the store to be removed
     */
    function removeStoreDetails(address payable _id)
        public
        onlyStoreRemoval(_id)
        whenNotPaused
    {
        isStore[_id] = false;
        StoreDetails memory _store = stores[_id];

        for (uint256 i = 0; i < storesAddresses.length.sub(1); i++) {
            if (storesAddresses[i] == _id) {
                storesAddresses[i] = storesAddresses[storesAddresses.length.sub(
                    1
                )];
                break;
            }
        }
        storesAddresses.length = storesAddresses.length.sub(1);

        for (
            uint256 i = 0;
            i < storesByOwner[_store.owner].length.sub(1);
            i++
        ) {
            if (storesByOwner[_store.owner][i] == _id) {
                storesByOwner[_store.owner][i] = storesByOwner[_store
                    .owner][storesByOwner[_store.owner].length.sub(1)];
                break;
            }
        }

        storesByOwner[_store.owner].length = storesByOwner[_store.owner]
            .length
            .sub(1);

        removeStoreOwner(_store.owner);
        delete stores[_id];
        emit StoreRemoved(_id);
    }

    /**
     * @dev Allows to set address of store owner to true in isStoreOwner[]
     * @param _owner The owner address
     */
    function addStoreOwner(address _owner) internal {
        if (!isStoreOwner[_owner]) {
            isStoreOwner[_owner] = true;
            emit StoreOwnerAdded(_owner);
        }
    }

    /**
     * @dev Allows to remove a store owner. Sets address of store owner to false in isStoreOwner[]
     * @param _owner The owner address
     */
    function removeStoreOwner(address _owner) internal {
        if (storesByOwner[_owner].length == 0) {
            isStoreOwner[_owner] = false;
            emit StoreOwnerRemoved(_owner);
        }
    }

    /**
     * @dev Allows to set ban status of a store
     * @param _id The store address
     * @param _status Ban status
     */
    function setBanStatus(address _id, bool _status) public onlyWallet {
        stores[_id].isBanned = _status;
    }

    /**
     * @dev Allows to get ban status of a store
     * @param _id The store address
     * @return Returns ban status
     */
    function isBanned(address _id) public view returns (bool) {
        return stores[_id].isBanned;
    }

    /**
     * @dev Allows to get the stores requests
     * @return Returns the stores requests
     */
    function getStoresRequestsOwners() public view returns (address[] memory) {
        return storesRequestsOwners;
    }

    /**
     * @dev Allows to get the stores requests
     * @param _owner The owner address of the store request
     * @return Returns the stores requests
     */
    function getStoreRequest(address _owner)
        public
        view
        returns (string memory, string memory)
    {
        StoreRequest memory _request = storesRequests[_owner];
        return (_request.name, _request.description);
    }

    /**
     * @dev Allows to get the properties of a store
     * @param _id The store address
     * @return Returns the store name, description, ownew and ban status
     */
    function getStore(address _id)
        public
        view
        returns (string memory, string memory, address, bool)
    {
        StoreDetails memory _store = stores[_id];
        return (_store.name, _store.description, _store.owner, _store.isBanned);
    }

    /**
     * @dev Allows to get the all the stores of one owner
     * @param _owner The owner address
     * @return Returns the stores addresses
     */
    function getStoresByOwner(address _owner)
        public
        view
        returns (address[] memory)
    {
        return storesByOwner[_owner];
    }

    /**
     * @dev Allows to get the stores addresses
     * @return Returns all stores addresses
     */
    function getStoresAddresses() public view returns (address[] memory) {
        return storesAddresses;
    }

    /**
     * @dev Allows to detroy the marketplace and all stores associated
     * @param _receiver The receiver address of the Ether value of this contract
     */
    function destroy(address payable _receiver) public onlyWallet {
        selfdestruct(_receiver);
        for (uint256 i = 0; i < storesAddresses.length - 1; i++) {
            removeStore(address(uint160(storesAddresses[i])));
        }
        emit MarketplaceDestroyed(address(this), _receiver);
    }
}
