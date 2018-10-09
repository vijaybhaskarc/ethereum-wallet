import ethers from 'ethers';

import { Transaction as TransactionUtils, Wallet as WalletUtils, ERC20 as ERC20Utils, Escrow as EscrowUtils } from '@common/utils';

const { Wallet, utils } = ethers;

import {Config} from '@common/constants';


export function sendTransaction(wallet, transaction) {
    if (!(wallet instanceof Wallet)) throw new Error('Invalid wallet');
    if (!TransactionUtils.isValidTransaction(transaction)) throw new Error('Invalid transaction');
    return wallet.sendTransaction(transaction);
}

export function sendERC20Transaction(wallet, transaction) {
    if (!TransactionUtils.isValidERC20Transaction(transaction)) throw new Error('Invalid transaction');
    return ERC20Utils.transferToken(wallet, transaction);
}

export async function sendEscrowAndTransaction(wallet, txn) {
    if (!TransactionUtils.isValidERC20Transaction(txn)) throw new Error('Invalid reserve transaction');
    let result = await EscrowUtils.escrowToken(wallet, txn);
    if (result != null) {
        erc20_txn = TransactionUtils.createERC20Transaction(Config.PARAMS.public_blockchain.unique_escrow_address, 
                txn.amount, txn.value);
        if (!TransactionUtils.isValidERC20Transaction(erc20_txn)) throw new Error('Invalid ERC20 transaction');
        console.log("sendEscrowAndTransaction(), escrow result=" + JSON.stringify(result) + ", erc20_txn=" + JSON.stringify(erc20_txn));
        let rc = ERC20Utils.transferToken(wallet, erc20_txn);
        console.log("sendEscrowAndTransaction(), post-escrow transfer result=" + JSON.stringify(rc));
        return rc;
    } else {
        console.log("sendEscrowAndTransaction(), initial reserve returned null!");
    }
}

export function sendEther(wallet, destination, amount, options) {
    if (!(wallet instanceof Wallet)) throw new Error('Invalid wallet');
    if (typeof destination !== 'string') throw new Error('Invalid destination address');
    if (!(amount instanceof utils.BigNumber)) amount = utils.parseEther(amount);
    return wallet.send(destination, amount, options);
}