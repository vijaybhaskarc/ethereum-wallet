import { wallet as WalletStore, wallets as WalletsStore } from '@common/stores';
import { Wallets as WalletsService, Api as ApiService } from '@common/services';
import { Wallet as WalletUtils } from '@common/utils';
import { ERC20 as ERC20Utils } from '@common/utils'; 


const walletCache = new Map();

export function addWalletToCache(wallet) {
    walletCache.set(wallet.privateKey, wallet);
}

export function removeWalletFromCache(wallet) {
    walletCache.delete(wallet.privateKey);
}

export function updateBalances() {
    walletCache.forEach(function(value, key, map) {
        updateBalance(value);
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
    //const balance = await wallet.getBalance();
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

export async function setReserve(wallet, reserve) {
    await WalletStore.setReserve(wallet.item, reserve);
}

export function getReserve(wallet) {
    return WalletStore.getReserve(wallet);
}