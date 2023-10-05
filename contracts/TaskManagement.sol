// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Assuming TaskToken is an ERC20-like token. 
// The actual implementation may vary based on your needs.
interface ITaskToken {
    function approve(address spender, uint256 amount) external returns (bool);
    function burn(uint256 amount) external;
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IAragonVoting {
    function newVote(bytes memory _executionScript, string memory _metadata, bool _castVote, bool _executesIfDecided) external returns (uint256 voteId);
    function getVoteOutcome(uint256 _voteId) external view returns (uint8); // Assume: 1 for YES, 2 for NO
}

contract TaskManagement {
    IAragonVoting public aragonVoting;
    ITaskToken public taskToken;

    mapping(uint256 => bytes) public proposals; // voteId => task details

    event TaskProposed(uint256 proposalId, bytes taskDetails);
    event TaskApproved(uint256 proposalId);
    event TaskRejected(uint256 proposalId);

    constructor(address _taskToken, address _aragonVoting) {
        taskToken = ITaskToken(_taskToken);
        aragonVoting = IAragonVoting(_aragonVoting);
    }

    function proposeTask(bytes memory _taskDetails) external {
        uint256 voteId = aragonVoting.newVote(_taskDetails, "Propose Task", true, true);
        proposals[voteId] = _taskDetails;
        emit TaskProposed(voteId, _taskDetails);
    }

    function getTaskOutcome(uint256 voteId) external {
        uint8 outcome = aragonVoting.getVoteOutcome(voteId);
        if (outcome == 1) {
            emit TaskApproved(voteId);
        } else if (outcome == 2) {
            emit TaskRejected(voteId);
        }
    }
}
