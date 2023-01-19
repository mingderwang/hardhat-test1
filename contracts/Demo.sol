// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

contract Demo {
    event Echo(string message);

    function echo(string calldata message) external {
        emit Echo(message);
    }
}
