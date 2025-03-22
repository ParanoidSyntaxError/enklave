// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {EKTime, IEKTime} from "./EKTime.sol";
import {IEKTimeFactory} from "./IEKTimeFactory.sol";

contract EKTimeFactory is IEKTimeFactory {
    address public immutable implementation;

    constructor() {
        implementation = address(new EKTime());
    }

    function create(
        string memory name,
        string memory symbol,
        address[] memory beforeMintHooks,
        address[] memory afterMintHooks
    ) external override returns (address) {
        address time = Clones.clone(implementation);
        IEKTime(time).initialize(name, symbol, beforeMintHooks, afterMintHooks);

        emit EKTimeCreated(time);

        return time;
    }
}
