// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IEKSubscriptionFactory {
    event EKSubscriptionCreated(address indexed subscription);

    function create(address timeToken, uint256 renewAmount) external returns (address);
}
