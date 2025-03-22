// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {EKSubscription, IEKSubscription} from "./EKSubscription.sol";
import {IEKSubscriptionFactory} from "./IEKSubscriptionFactory.sol";

contract EKSubscriptionFactory is IEKSubscriptionFactory {
    address public immutable implementation;

    constructor() {
        implementation = address(new EKSubscription());
    }

    function create(
        address timeToken,
        uint256 renewAmount
    ) external override returns (address) {
        address subscription = Clones.clone(implementation);
        IEKSubscription(subscription).initialize(timeToken, renewAmount);

        emit EKSubscriptionCreated(subscription);

        return subscription;
    }
}
