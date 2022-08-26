// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

// Import this file to use console.log
import "hardhat/console.sol";

contract BMAC {
    // Event emitted when a Memo is added to the blockchain
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct;
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Array of Memos
    Memo[] public memos;

    // Deployer address
    address payable owner;

    // Deployment Logic
    constructor() {
        owner = payable(msg.sender);
    }

    /*
     * @dev buy coffee for contract owner
     * @param _amount amount of coffee to buy #TODO
     * @param _name name of the buyer
     * @param _message message from the buyer
     */
    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value >= 0, "Amount must be greater than 0");
        // Create a new Memo
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        // Emit the NewMemo event
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /*
     * @dev withdraw coffee from contract owner
     */
    function withdraw() public {
        require(owner.send(address(this).balance));
    }

    /*
     * @dev fetch all memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
