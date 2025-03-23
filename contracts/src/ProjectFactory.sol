// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IEKPostFactory} from "./post/IEKPostFactory.sol";
import {EKTimePrice} from "./time/EKTimePrice.sol";
import {IEKTimeFactory} from "./time/IEKTimeFactory.sol";
import {IEKSubscriptionFactory} from "./subscription/IEKSubscriptionFactory.sol";

contract ProjectFactory {
    address public constant ekPostFactory =
        0x9a1420D31921e744ea0d85c387754CB2f716fDaA;
    address public constant ekTimeFactory =
        0xF3093B7B0eEA4E7BE8F4dc6C56eC0C1c5c25Fa62;

    address[] public tokens;

    constructor() {
        tokens.push(0x036CbD53842c5426634e7929541eC2318f3dCF7e);
    }

    function create(
        address owner,
        string memory name,
        string memory symbol,
        uint256 price
    ) external {
        IEKPostFactory(ekPostFactory).create(owner, name, symbol);

        uint256[] memory prices = new uint256[](1);
        prices[0] = price;
        address timePrice = address(new EKTimePrice(tokens, prices));

        address[] memory beforeMintHooks = new address[](1);
        beforeMintHooks[0] = timePrice;
        IEKTimeFactory(ekTimeFactory).create(
            name,
            symbol,
            beforeMintHooks,
            new address[](0)
        );
    }
}
