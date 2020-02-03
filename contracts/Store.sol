pragma solidity 0.5.2;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./Marketplace.sol";

/** 
 * @title Store 
 * @author Pedro Cruz
 * @dev This contract represents a store. 
 * It allows to add, update or remove products to the store and is controlled by the owner.
 * Can be banned and destroyed by the marketplace. Funds always goes to store owner.
 */
contract Store {
    using SafeMath for uint256;

    /*
     *  Storage
     */
    address payable public owner;
    Marketplace public marketplace;
    mapping(bytes32 => Product) private products;
    bytes32[] private productsIds;

    struct Product {
        bytes32 id;
        string name;
        string description;
        uint256 price;
        uint256 quantity;
    }

    /*
     *  Events
     */
    event Withdraw(address id, uint256 amount);
    event ProductAdded(
        bytes32 id,
        string name,
        string description,
        uint256 price,
        uint256 quantity
    );
    event ProductDeleted(bytes32 id);
    event ProductBought(
        bytes32 id,
        string name,
        string description,
        uint256 price,
        uint256 quantitiy
    );
    event ProductPriceUpdated(bytes32 id, uint256 oldPrice, uint256 newPrice);
    event ProductNameUpdated(bytes32 id, string oldName, string newName);
    event ProductQuantityUpdated(
        bytes32 id,
        uint256 oldQuantity,
        uint256 newQuantity
    );
    event ProductDescriptionUpdated(
        bytes32 id,
        string oldDescription,
        string newDescription
    );
    event StoreRemoved(address id);

    /*
     *  Modifiers
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "msg.sender is not owner");
        _;
    }

    modifier onlyMarketplaceOrOwner() {
        require(
            msg.sender == address(marketplace) || msg.sender == owner,
            "msg.sender is not owner or the marketplace"
        );
        _;
    }

    modifier hasBalance() {
        require(address(this).balance > 0, "Balance is zero");
        _;
    }

    modifier hasStock(bytes32 _id, uint256 _quantity) {
        require(products[_id].quantity >= _quantity, "Sold out");
        _;
    }

    modifier notBanned() {
        require(!marketplace.isBanned(address(this)), "Store is banned");
        _;
    }

    modifier whenNotPaused() {
        require(!marketplace.paused(), "Store is paused");
        _;
    }

    modifier productExists(bytes32 _id) {
        require(products[_id].id != bytes32(0), "Store is banned");
        _;
    }

    modifier refund(bytes32 _id, uint256 _quantity) {
        Product memory _product = products[_id];
        uint256 _totalAmount = _quantity.mul(products[_id].price);

        require(msg.value >= _totalAmount);

        if (msg.value > _totalAmount) {
            msg.sender.transfer(msg.value.sub(_totalAmount));
        }
        _;
    }

    /**
     * @dev Initilizes the store. Sets the marketplace and owner addresses.
     * @param _marketplace Address of the marketplace
     * @param _owner Owner of this store
     */
    constructor(address _marketplace, address payable _owner) public {
        marketplace = Marketplace(_marketplace);
        owner = _owner;
    }

    /**
     * @dev Allows to add a new product to the store.
     * @param _name The name of the product
     * @param _description The description of the product
     * @param _price The price of the product
     * @param _quantity The quantity of the product
     * @return Returns the product id
     */
    function addProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantity
    ) public onlyOwner notBanned whenNotPaused returns (bytes32) {
        bytes32 _id = keccak256(
            abi.encodePacked(_name, _quantity, block.timestamp)
        );
        Product memory _product = Product(
            _id,
            _name,
            _description,
            _price,
            _quantity
        );
        products[_id] = _product;
        productsIds.push(_id);
        emit ProductAdded(_id, _name, _description, _price, _quantity);
        return _id;
    }

    /**
     * @dev Allows to update a product price.
     * @param _id The id of the product
     * @param _newPrice The new price of the product
     */
    function updateProductPrice(bytes32 _id, uint256 _newPrice)
        public
        onlyOwner
        notBanned
        whenNotPaused
        productExists(_id)
    {
        Product storage _product = products[_id];
        uint256 _oldPrice = _product.price;
        _product.price = _newPrice;
        emit ProductPriceUpdated(_id, _oldPrice, _newPrice);
    }

    /**
     * @dev Allows to update a product name.
     * @param _id The id of the product
     * @param _newName The new name of the product
     */
    function updateProductName(bytes32 _id, string memory _newName)
        public
        onlyOwner
        notBanned
        whenNotPaused
        productExists(_id)
    {
        Product storage _product = products[_id];
        string memory _oldName = _product.name;
        _product.name = _newName;
        emit ProductNameUpdated(_id, _oldName, _newName);
    }

    /**
     * @dev Allows to update a product description.
     * @param _id The id of the product
     * @param _newDescription The new price of the product
     */
    function updateProductDescription(
        bytes32 _id,
        string memory _newDescription
    ) public onlyOwner notBanned productExists(_id) whenNotPaused {
        Product storage _product = products[_id];
        string memory _oldDescription = _product.description;
        _product.description = _newDescription;
        emit ProductDescriptionUpdated(_id, _oldDescription, _newDescription);
    }

    /**
     * @dev Allows to update a product quantity.
     * @param _id The id of the product
     * @param _newQuantity The new price of the product
     */
    function updateProductQuantity(bytes32 _id, uint256 _newQuantity)
        public
        onlyOwner
        notBanned
        productExists(_id)
        whenNotPaused
    {
        Product storage _product = products[_id];
        uint256 _oldQuantity = _product.quantity;
        _product.quantity = _newQuantity;
        emit ProductQuantityUpdated(_id, _oldQuantity, _newQuantity);
    }

    /**
     * @dev Deletes a product
     * @param _id The id of the product
     */
    function deleteProduct(bytes32 _id)
        public
        onlyOwner
        notBanned
        productExists(_id)
        whenNotPaused
    {
        delete products[_id];
        for (uint256 i = 0; i < productsIds.length.sub(1); i++) {
            if (productsIds[i] == _id) {
                productsIds[i] = productsIds[productsIds.length.sub(1)];
                break;
            }
        }
        productsIds.length = productsIds.length.sub(1);
        emit ProductDeleted(_id);
    }

    /**
     * @dev Allows users to buy a product
     * @param _id The id of the product
     * @param _quantity The quantitiy of the product to buy
     */
    function buyProduct(bytes32 _id, uint256 _quantity)
        public
        payable
        notBanned
        productExists(_id)
        hasStock(_id, _quantity)
        refund(_id, _quantity)
        whenNotPaused
    {
        Product storage _product = products[_id];
        _product.quantity = _product.quantity.sub(_quantity);
        emit ProductBought(
            _product.id,
            _product.name,
            _product.description,
            _product.price,
            _product.quantity
        );
    }

    /**
     * @dev Allows to get a product by id
     * @param _id The id of the product
     * @return Returns product name, description, price and quantity
     */
    function getProduct(bytes32 _id)
        public
        view
        productExists(_id)
        returns (string memory, string memory, uint256, uint256)
    {
        return (
            products[_id].name,
            products[_id].description,
            products[_id].price,
            products[_id].quantity
        );
    }

    /**
     * @dev Allows to get balance of the store.
     * @return Returns balance of the store
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Allows to get all product ids
     * @return Returns products ids
     */
    function getProductsIds() public view returns (bytes32[] memory) {
        return productsIds;
    }

    /**
     * @dev Allows owner to withdraw balance
     */
    function withdraw() public onlyOwner hasBalance {
        uint256 balance = address(this).balance;
        owner.transfer(balance);
        emit Withdraw(address(this), balance);
    }

    /**
     * @dev Allows marketplace or store owner to destroy store and send balance to store owner
     */
    function destroy() public onlyMarketplaceOrOwner {
        marketplace.removeStoreDetails(address(this));

        selfdestruct(owner);
        emit StoreRemoved(address(this));
    }

    /**
     * @dev Allows to receive ether
     */
    function() external payable {}
}
