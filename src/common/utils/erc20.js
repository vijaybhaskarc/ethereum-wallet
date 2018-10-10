import ethers from 'ethers';

import { Config } from '@common/constants';

import { PROVIDER } from "./wallet";

const { Contract } = ethers;

const ERC20_ADDRESS = Config.PARAMS.public_blockchain.erc20_address;

const ABI_balanceOf = [
    {
        "constant": true,
        "inputs": [
          {
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

export const getBalance = async (wallet) => {
    const tokenAddress = ERC20_ADDRESS;
    const contract = new Contract(tokenAddress, ABI_balanceOf, PROVIDER);
    try {
        const balance = await contract.balanceOf(wallet.address);
        let result = balance.toString();
        console.log("getBalance, address = " + wallet.address + ", balance=" + result);
        return result;
    } catch (e) { 
        console.log("getBalance, e=" + JSON.stringify(e));
    }
}

const ABI_transfer = [
    {
       "name" : "transfer",
       "type" : "function",
       "inputs" : [
          {
             "name" : "_to",
             "type" : "address"
          },
          {
             "type" : "uint256",
             "name" : "_tokens"
          }
       ],
       "constant" : false,
       "outputs" : [],
       "payable" : false
    }
 ];

 export const transferToken = async(wallet, txn) => {
    try {
        var contract = new ethers.Contract(ERC20_ADDRESS, ABI_transfer, wallet);
        //TODO 
        //var numberOfDecimals = 18;
        // convert token
        //var numberOfTokens = ethers.utils.parseUnits(amount, numberOfDecimals);
        var numberOfTokens = txn.amount;
        // send tokens
        let result = contract.transfer(txn.to, numberOfTokens);
        
        console.log("transferToken, immediate result=" + JSON.stringify(result));
        return result;
    } catch (e) {
        console.log("transferToken, e = " + JSON.stringify(e));
        fail(e); 
    }
}

