import { action, observable } from 'mobx';
import { Transaction as TransactionUtils } from '@common/utils';
import ethers from 'ethers';

const INITIAL = {
    item: null,
    history: [],
    pendingTransactions: [],
    loading: false,
    reserves:{}
};

export class WalletStore {

    @observable item = INITIAL.item;
    @observable history = INITIAL.history;
    @observable pendingTransactions = INITIAL.pendingTransactions;
    @observable loading = INITIAL.loading;
    @observable reserves = INITIAL.reserves;

    @action isLoading(state) {
        this.loading = Boolean(state);
    }

    @action select(wallet) {
        if (!(wallet instanceof ethers.Wallet)) throw new Error('Invalid Wallet');
        this.item = wallet;
    }

    @action setHistory(history) {
        if (!this.item) throw new Error(`Can't update the history. No wallet was selected.`);
        if (!(history instanceof Array)) throw new Error('The history must be an array.');
        this.history = history;
    }

    @action setReserve(item, reserve) {
        console.log("setReserve: item =" + JSON.stringify(item));
        this.reserves[item.address] = reserve;
    }

    getReserve(item) {
        r = this.reserves[item.address];
        if (r === undefined || isNaN(r)) {
            return 0.0;
        }
        return r;
    }
    
    @action addPendingTransaction(txn) {
        this.pendingTransactions.push(txn);
    }

    @action moveToHistory(txn) {
        const pending = this.pendingTransactions.filter(tx => txn.hash !== tx.hash);
        this.pendingTransactions = pending;
        this.history.push(txn);
    }

    @action reset() {
        this.item = INITIAL.item;
        this.history = INITIAL.history;
        this.pendingTransactions = INITIAL.pendingTransactions;
        this.loading = INITIAL.loading;
        this.reserves = INITIAL.reserves;
    }
}

export default new WalletStore();