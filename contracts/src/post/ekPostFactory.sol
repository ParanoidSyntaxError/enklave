// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {ekPost} from "./ekPost.sol";

contract ekPostFactory {
    address public immutable implementation;

    constructor() {
        implementation = address(new ekPost());
    }

    function create(
        address owner,
        string memory name,
        string memory symbol
    ) external returns (address) {
        address post = Clones.clone(implementation);
        ekPost(post).initialize(owner, name, symbol);
        
        return post;
    }
}
