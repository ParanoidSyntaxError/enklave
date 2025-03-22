// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {ekTime} from "./ekTime.sol";

contract ekTimeFactory {
    address public immutable implementation;

    constructor() {
        implementation = address(new ekTime());
    }

    function create(
        string memory name,
        string memory symbol,
        address[] memory beforeMintHooks,
        address[] memory afterMintHooks
    ) external returns (address) {
        address time = Clones.clone(implementation);
        ekTime(time).initialize(name, symbol, beforeMintHooks, afterMintHooks);

        return time;
    }
}
