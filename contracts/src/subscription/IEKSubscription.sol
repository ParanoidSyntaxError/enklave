// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IEKSubscription {
    function renew(address account, address token) external;
}
