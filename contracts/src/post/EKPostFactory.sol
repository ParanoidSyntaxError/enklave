// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {IEKPostFactory} from "./IEKPostFactory.sol";
import {EKPost, IEKPost} from "./EKPost.sol";

contract EKPostFactory is IEKPostFactory {
    address public immutable implementation;

    constructor() {
        implementation = address(new EKPost());
    }

    function create(
        address owner,
        string memory name,
        string memory symbol
    ) external override returns (address) {
        address post = Clones.clone(implementation);
        IEKPost(post).initialize(owner, name, symbol);

        emit EKPostCreated(post);

        return post;
    }
}
