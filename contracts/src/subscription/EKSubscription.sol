// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import {IEKTime} from "../time/IEKTime.sol";
import {IEKSubscription} from "./IEKSubscription.sol";

contract EKSubscription is Initializable, IEKSubscription {
    address public time;

    uint256 public amount;

    function initialize(
        address timeToken,
        uint256 renewAmount
    ) external override initializer {
        time = timeToken;
        amount = renewAmount;
    }

    function renew(address account, address token) external override {
        if (IERC20(time).balanceOf(account) > 2 * (10 ** 18)) {
            revert();
        }

        IERC20(token).transferFrom(account, address(this), amount);
        IERC20(token).approve(time, amount);

        IEKTime(time).mint(token, amount, account, "");
    }
}
