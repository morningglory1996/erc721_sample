// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./Color.sol";

contract ColorExchange {
    Color public color;

    constructor(Color _color) public {
        color = _color;
    }

    function buyTokens(uint256 _tokenId) public {
        address owner = color.ownerOf(_tokenId);
        color.transferFrom(owner, msg.sender, _tokenId);
    }
}
