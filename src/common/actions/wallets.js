import { wallet as WalletStore, wallets as WalletsStore } from '@common/stores';
import { Wallets as WalletsService, Api as ApiService } from '@common/services';
import { Wallet as WalletUtils } from '@common/utils';
import { ERC20 as ERC20Utils } from '@common/utils'; 


const walletCache = new Map();

export function addWalletToCache(wallet) {
    if (wallet.item != null) {
        walletCache.set(wallet.privateKey, wallet.item);
    } else {
        walletCache.set(wallet.privateKey, wallet);
    }
}

export function removeWalletFromCache(wallet) {
    walletCache.delete(wallet.privateKey);
}

export function updateBalances() {
    walletCache.forEach(function(value, key, map) {
        updateBalance(value);
    });
}

export function updateReserves() {
    walletCache.forEach(function(value, key, map) {
        updateReserve(value);
    });
}

export async function addWallet(walletName, wallet, walletDescription = '') {
    WalletsStore.isLoading(true);
    WalletsStore.addWallet(walletName, wallet, walletDescription);
    addWalletToCache(wallet);
    WalletsStore.isLoading(false);
}

export async function loadWallets() {
    WalletsStore.isLoading(true);
    const pks = await WalletsService.loadWalletPKs();
    pks.map(({ description, name, privateKey }) => {
        const wallet = WalletUtils.loadWalletFromPrivateKey(privateKey);
        WalletsStore.addWallet(name, wallet, description);
        addWalletToCache(wallet);
    });
    WalletsStore.isLoading(false);
}

export async function updateBalance(wallet) {
    const balance = await ERC20Utils.getBalance(wallet);
    WalletsStore.setBalance(wallet.getAddress(), balance);
}

export async function removeWallet(wallet) {
    WalletsStore.removeWallet(wallet);
    removeWalletFromCache(wallet);
}

export async function saveWallets() {
    await WalletsService.saveWalletPKs(WalletsStore.list);
}

export async function selectWallet(wallet) {
    WalletStore.select(wallet);
}

export async function updateHistory(wallet) {
    WalletStore.isLoading(true);
    const { data } = await ApiService.getHistory(wallet.getAddress());
    if (data.status == 1) WalletStore.setHistory(data.result);
    WalletStore.isLoading(false);
}

export function getReserve(item) {
    return WalletStore.getReserve(item);
}

export async function setReserve(item, reserve) {
    await WalletStore.setReserve(item, reserve);
}

export async function updateReserve(item) {
    let _item = item;
    if (_item.item != null) {
        _item = _item.item;
    }
    const reserve = await ERC20Utils.getReserve(_item);
    WalletStore.setReserve(_item, reserve);
}

export async function updateEscrowAddress(wallet) {
    let address = await ERC20Utils.createEscrowAddress(wallet);
    if (address != null) {
        address = await ERC20Utils.getEscrowAddress(wallet);
    }
    console.log("updateEscrowAddress(): wallet = " + JSON.stringify(wallet) + ", escrowAddress=" + address);
    WalletStore.setEscrowAddress(wallet, address);
}

export function getEscrowAddress(item) {
    return WalletStore.getEscrowAddress(item);
}

export async function setEscrowAddress(item, address) {
    await WalletStore.setEscrowAddress(item, address);
}

