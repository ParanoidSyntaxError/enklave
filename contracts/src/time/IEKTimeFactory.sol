// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IEKTimeFactory {
    event EKTimeCreated(address indexed time);

    function create(
        string memory name,
        string memory symbol,
        address[] memory beforeMintHooks,
        address[] memory afterMintHooks
    ) external returns (address);
}
