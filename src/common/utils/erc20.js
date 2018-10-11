import ethers from 'ethers';

import { Config } from '@common/constants';

import { PROVIDER } from "./wallet";

import { Wallets as WalletActions } from '@common/actions';

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
        console.log("transferToken, wallet = " + JSON.stringify(wallet) + ", to=" + txn.to + ", value="+ numberOfTokens);
        let result = contract.transfer(txn.to, numberOfTokens);
        console.log("transferToken, immediate result=" + JSON.stringify(result));
        return result;
    } catch (e) {
        console.log("transferToken, e = " + JSON.stringify(e));
        fail(e); 
    }
}

const ABI_createEscrow = [
    {
        "constant": false,
        "inputs": [],
        "name": "createEscrow",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const createEscrowAddress = async (wallet) => {
    const tokenAddress = ERC20_ADDRESS;
    const contract = new Contract(tokenAddress, ABI_createEscrow, wallet);
    try {
        const address = await contract.createEscrow();
        let result = address.toString();
        console.log("createEscrowAddress(), wallet addr = " + wallet.address + ", escrow addr =" + JSON.stringify(address));

        return result;
    } catch (e) { 
        console.log("createEscrowAddress(), e=" + JSON.stringify(e));
    }
}

const ABI_escrowOf = [
    {
        "constant": true,
        "inputs": [
          {
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "escrowOf",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
];

export const getEscrowAddress = async (wallet) => {
    const tokenAddress = ERC20_ADDRESS;
    const contract = new Contract(tokenAddress, ABI_escrowOf, wallet);
    try {
        const address = await contract.escrowOf(wallet.address);
        let result = address.toString();
        console.log("getEscrowAddress(), wallet addr = " + wallet.address + ", escrow addr =" + JSON.stringify(address));
        
        return result;
    } catch (e) { 
        console.log("getEscrowAddress(), e=" + JSON.stringify(e));
    }
}

export const getReserve = async (wallet) => {
    const contract = new Contract(ERC20_ADDRESS, ABI_balanceOf, PROVIDER);
    try {
        const escrowAddress = WalletActions.getEscrowAddress(wallet);
        const reserve = await contract.balanceOf(escrowAddress);
        let result = reserve.toString();
        console.log("getReserve(), escrow address = " + escrowAddress + ", reserve=" + JSON.stringify(result));
        return result;
    } catch (e) { 
        console.log("getReserve(), e=" + JSON.stringify(e));
    }
}

export const escrow = async(wallet, txn) => {
    try {
        var contract = new ethers.Contract(ERC20_ADDRESS, ABI_transfer, wallet);
        //TODO 
        //var numberOfDecimals = 18;
        // convert token
        //var numberOfTokens = ethers.utils.parseUnits(amount, numberOfDecimals);
        var numberOfTokens = txn.amount;
        // send tokens
        console.log("escrow(), wallet = " + JSON.stringify(wallet) + ", txn.to = " + txn.to 
                + ", numberOfTokens = " + numberOfTokens);
        let result = contract.transfer(txn.to, numberOfTokens);
        return result;
    } catch (e) {
        console.log("escrow(), e = " + JSON.stringify(e));
        fail(e);
    }
}

