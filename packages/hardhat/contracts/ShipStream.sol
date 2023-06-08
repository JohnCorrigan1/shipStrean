//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
// import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

contract ShipStream {
  // State Variables

  struct Stream {
    uint256 duration;
    uint256 frequency;
    uint256 startTime;
    uint256 endTime;
    uint256 startBalance;
    uint256 currentBalance;
    string[] uploads;
    bool active;
    uint256 pardons;
    uint256 pardonsUsed;
    uint256 streamed;
  }

  address public immutable owner;
  uint256 public totalStreams;
  mapping(address => Stream[]) public streams;

  // Events: a way to emit log statements from smart contract that can be listened to by external parties
  //   event GreetingChange(address indexed greetingSetter, string newGreeting, bool premium, uint256 value);

  // Constructor: Called once on contract deployment
  // Check packages/hardhat/deploy/00_deploy_your_contract.ts
  constructor(address _owner) {
    owner = _owner;
  }

  // Modifier: used to define a set of rules that must be met before or after a function is executed
  // Check the withdraw() function
  modifier isOwner() {
    // msg.sender: predefined variable that represents address of the account that called the current function
    require(msg.sender == owner, "Not the Owner");
    _;
  }

  function createStream(uint256 duration, uint256 frequency, uint256 pardons) public payable {
    require(msg.value > 0, "Must send ether to create a stream");
    require(duration > 0, "Duration must be greater than 0");
    require(frequency > 0, "Frequency must be greater than 0");
    require(pardons >= 0, "Pardons must be greater than or equal to 0");
    require(duration > frequency, "Duration must be greater than frequency");
    require(pardons <= duration / frequency, "Pardons must be less than or equal to duration / frequency");
    require(duration % frequency == 0, "Duration must be divisible by frequency");

    Stream memory stream = Stream({
      duration: duration,
      frequency: frequency,
      startTime: block.timestamp,
      endTime: block.timestamp + duration,
      startBalance: msg.value,
      currentBalance: msg.value,
      uploads: new string[](0),
      active: true,
      pardons: pardons,
      pardonsUsed: 0,
      streamed: 0
    });
    streams[msg.sender].push(stream);
    totalStreams += 1;
  }

  function uploadString(string memory upload, uint stream) public {
    require(streams[msg.sender][stream].active, "Stream is not active");
  }

  function closeStream() public {}

  function withdraw() public isOwner {}

  function balanceOf(address user) public view returns (uint256) {
    uint256 balance = 0;
    for (uint256 i = 0; i < streams[user].length; i++) {
      balance += streams[user][i].currentBalance;
    }
    return balance;
  }

  receive() external payable {}
}
