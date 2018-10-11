import ethers from 'ethers';

import { Transaction as TransactionUtils, ERC20 as ERC20Utils } from '@common/utils';

const { Wallet, utils } = ethers;

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
    let result = await ERC20Utils.escrow(wallet, txn);
    if (result != null) {
        return result;
    } else {
        console.log("sendEscrowAndTransaction(), escrow transfer returned null!");
    }
}

export function sendEther(wallet, destination, amount, options) {
    if (!(wallet instanceof Wallet)) throw new Error('Invalid wallet');
    if (typeof destination !== 'string') throw new Error('Invalid destination address');
    if (!(amount instanceof utils.BigNumber)) amount = utils.parseEther(amount);
    return wallet.send(destination, amount, options);
}