// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721 {
    string[] public colors;
    mapping(string => bool) _colorExists;

    constructor() public ERC721("Color", "COLOR") {}

    function mint(string memory _color) public {
        require(!_colorExists[_color]);
        uint256 _id = colors.length;
        colors.push(_color);
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
    }
}
