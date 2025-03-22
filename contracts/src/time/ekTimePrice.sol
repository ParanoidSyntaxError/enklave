// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IEKTimeHook} from "./IEKTimeHook.sol";

contract ekTimePrice is IEKTimeHook {
    mapping(address => uint256) private _tokenPrices;

    constructor(address[] memory tokens, uint256[] memory prices) {
        for (uint256 i = 0; i < tokens.length; i++) {
            _tokenPrices[tokens[i]] = prices[i];
        }
    }

    function beforeMint(
        address /* sender */,
        address token,
        uint256 value,
        address /* receiver */,
        uint256 /* amount */,
        bytes memory /* data */
    ) external view override returns (uint256, uint256, uint256, bytes memory) {
        if (_tokenPrices[token] == 0 || value < _tokenPrices[token]) {
            revert();
        }

        return (0, 0, value / _tokenPrices[token], "");
    }

    function afterMint(
        address sender,
        address token,
        uint256 value,
        address receiver,
        uint256 amount,
        bytes memory data
    ) external override returns (bytes memory) {}
}
