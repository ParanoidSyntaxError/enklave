// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IEKPostFactory {
    event EKPostCreated(address indexed post);

    function create(
        address owner,
        string memory name,
        string memory symbol
    ) external returns (address);
}
