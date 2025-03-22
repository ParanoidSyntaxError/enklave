// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ekTime} from "../time/ekTime.sol";

contract ekSubscription {
    address public immutable time;

    uint256 public immutable amount;

    constructor(address timeToken, uint256 renewAmount) {
        time = timeToken;
        amount = renewAmount;
    }

    function renew(address account, address token) external {
        if(IERC20(time).balanceOf(account) > 2 * (10 ** 18)) {
            revert();
        }

        IERC20(token).transferFrom(account, address(this), amount);
        IERC20(token).approve(time, amount);
        
        ekTime(time).mint(
            token,
            amount,
            account,
            ""
        );
    }
}
