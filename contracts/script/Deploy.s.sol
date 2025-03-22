// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";

import {EKPostFactory} from "../src/post/EKPostFactory.sol";
import {EKTimeFactory} from "../src/time/EKTimeFactory.sol";
import {EKSubscriptionFactory} from "../src/subscription/EKSubscriptionFactory.sol";

contract Deploy is Script {
    function run()
        external
        returns (EKPostFactory, EKTimeFactory, EKSubscriptionFactory)
    {
        vm.startBroadcast();

        EKPostFactory postFactory = new EKPostFactory();
        EKTimeFactory timeFactory = new EKTimeFactory();
        EKSubscriptionFactory subscriptionFactory = new EKSubscriptionFactory();

        vm.stopBroadcast();

        return (postFactory, timeFactory, subscriptionFactory);
    }
}
