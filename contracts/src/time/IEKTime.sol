// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IEKTime {
    function initialize(
        string memory initName,
        string memory initSymbol,
        address[] memory initBeforeMintHooks,
        address[] memory initAfterMintHooks
    ) external;

    function mint(
        address token,
        uint256 value,
        address receiver,
        bytes memory data
    ) external returns (uint256);
}
