// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IEKSubscription {
    function initialize(address timeToken, uint256 renewAmount) external;

    function renew(address account, address token) external;
}
