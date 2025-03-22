// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IEKTimeHook {
    function beforeMint(
        address sender,
        address token,
        uint256 value,
        address receiver,
        uint256 amount,
        bytes memory data
    ) external returns (
        uint256 hookValue,
        uint256 hookAmount,
        uint256 modifiedAmount,
        bytes memory modifiedData
    );

    function afterMint(
        address sender,
        address token,
        uint256 value,
        address receiver,
        uint256 amount,
        bytes memory data
    ) external returns (
        bytes memory modifiedData
    );
}
