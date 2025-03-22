// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import {IEKTimeHook} from "./IEKTimeHook.sol";

contract ekTime is ERC20, Initializable {
    string private _name;
    string private _symbol;

    address[] public beforeMintHooks;
    address[] public afterMintHooks;
    
    // One token equals one day
    uint256 public constant DECAY = uint256(10 ** 18) / uint256(86400);
    mapping(address => uint256) private _decayTimestamps;

    constructor() ERC20("", "") {}

    function initialize(
        string memory initName,
        string memory initSymbol,
        address[] memory initBeforeMintHooks,
        address[] memory initAfterMintHooks
    ) external initializer {
        _name = initName;
        _symbol = initSymbol;

        beforeMintHooks = initBeforeMintHooks;
        afterMintHooks = initAfterMintHooks;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if(_decayTimestamps[account] == 0) {
            return 0;
        }

        uint256 balance = super.balanceOf(account);
        uint256 balanceDecay = (_decayTimestamps[account] - block.timestamp) * DECAY;

        if(balanceDecay >= balance) {
            return 0;
        }

        return balance - balanceDecay;
    }

    function mint(
        address token,
        uint256 value,
        address receiver,
        bytes memory data
    ) external returns (uint256) {
        uint256 amount = value;
        uint256 totalHookValue = 0;

        for (uint256 i = 0; i < beforeMintHooks.length; i++) {
            (
                uint256 hookValue,
                uint256 hookAmount,
                uint256 modifiedAmount,
                bytes memory modifiedData
            ) = IEKTimeHook(beforeMintHooks[i]).beforeMint(
                    msg.sender,
                    token,
                    value,
                    receiver,
                    amount,
                    data
                );

            amount = modifiedAmount;
            data = modifiedData;

            totalHookValue += hookValue;
            if (totalHookValue > value) {
                revert();
            }

            ERC20(token).transferFrom(
                msg.sender,
                beforeMintHooks[i],
                hookValue
            );
            _mint(receiver, hookAmount);
        }

        uint256 remainingValue = value - totalHookValue;
        if (remainingValue > 0) {
            ERC20(token).transferFrom(
                msg.sender,
                address(this),
                remainingValue
            );
        }
        _mint(receiver, amount);

        for (uint256 i = 0; i < beforeMintHooks.length; i++) {
            data = IEKTimeHook(beforeMintHooks[i]).afterMint(
                msg.sender,
                token,
                value,
                receiver,
                amount,
                data
            );
        }

        return amount;
    }

    function _update(address from, address to, uint256 value) internal override {
        super._update(from, to, value);

        _decayTimestamps[to] = block.timestamp;
    }
}