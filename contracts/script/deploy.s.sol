// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";

import {EKPostFactory} from "../src/post/EKPostFactory.sol";
import {EKTimeFactory} from "../src/time/EKTimeFactory.sol";
import {EKSubscriptionFactory} from "../src/subscription/EKSubscriptionFactory.sol";

contract DeploySimpleStorage is Script {
    function run() external {
        vm.startBroadcast();

        new EKPostFactory();
        new EKTimeFactory();
        new EKSubscriptionFactory();

        vm.stopBroadcast();
    }
}
