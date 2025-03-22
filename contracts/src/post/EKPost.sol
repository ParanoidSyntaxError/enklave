// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC165} from "@openzeppelin/contracts/interfaces/IERC165.sol";

import {IEKPost} from "./IEKPost.sol";

contract EKPost is ERC721, ERC721URIStorage, Ownable, Initializable, IEKPost {
    uint256 private _nextTokenId;

    string private _name;
    string private _symbol;

    constructor() ERC721("", "") Ownable(address(this)) {}

    function initialize(
        address initOwner,
        string memory initName,
        string memory initSymbol
    ) external override initializer {
        _transferOwnership(initOwner);

        _name = initName;
        _symbol = initSymbol;
    }

    function safeMint(
        address to,
        string memory uri
    ) external override onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
