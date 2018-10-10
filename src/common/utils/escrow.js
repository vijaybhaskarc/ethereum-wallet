import ethers from 'ethers';

import { Config } from '@common/constants';

import { PROVIDER } from "./wallet";

const { Contract } = ethers;

const ESCROW_ADDRESS = Config.PARAMS.public_blockchain.unique_escrow_address;

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

export const getReserve = async (item) => {
    const tokenAddress = ESCROW_ADDRESS;
    const contract = new Contract(tokenAddress, ABI_balanceOf, PROVIDER);
    try {
        let address = item.address;
        if (address == undefined) {
            address = item.item.address;
        }
        let reserve = await contract.balanceOf(address);
        return reserve;
    } catch (e) { 
        console.log("getReserve(), item = " + JSON.stringify(item) + ", e=" + JSON.stringify(e));
    }
}

const ABI_transfer = [
    {
        "constant": false,
        "inputs": [
          {
            "name": "from",
            "type": "address"
          },
          {
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "escrow",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

 export const escrowToken = async(wallet, txn) => {
    try {
        var contract = new ethers.Contract(ESCROW_ADDRESS, ABI_transfer, wallet);
        //TODO 
        //var numberOfDecimals = 18;
        // convert token
        //var numberOfTokens = ethers.utils.parseUnits(amount, numberOfDecimals);
        var numberOfTokens = txn.amount;
        // send tokens
        let result = contract.escrow(txn.to, numberOfTokens);
        console.log("escrowToken, immediate result=" + JSON.stringify(result));
        return result;
    } catch (e) {
        console.log("escrowToken, e = " + JSON.stringify(e));
        fail(e); 
    }
}

