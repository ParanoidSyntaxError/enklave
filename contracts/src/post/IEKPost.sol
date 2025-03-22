// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IEKPost is IERC721 {
    function initialize(
        address initOwner,
        string memory initName,
        string memory initSymbol
    ) external;

    function safeMint(address to, string memory uri) external returns (uint256);
}
