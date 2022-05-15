pragma solidity ^0.8.0;
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;
    constructor() {
        _status = _NOT_ENTERED;
    }
    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}
pragma solidity^0.8.11;
contract Faucet is ReentrancyGuard{
    uint256 public defualtValue = 0.1 ether;
    constructor() {
    }
    function returnDefaultValue() external view returns (uint256){
        return defualtValue;
    }
    function getEther(address _recipient) external nonReentrant returns(bool){
        (bool res,) = payable(_recipient).call{value: defualtValue}("");
        require(res, "Failed To send ether");
        return res;
    }
     receive() external payable {}
     fallback() external payable {}
}