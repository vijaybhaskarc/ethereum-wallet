import axios from 'axios';
import { Url } from '@common/constants';

export function getPrice() {
    // Convert ICASH to currencies
    return axios.get(`${Url.CRYPTO_COMPARE}/data/price?fsym=ICASH&tsyms=USD,EUR,BRL`);
}

export function getHistory(address) {
    return axios.get(`${Url.ETHERSCAN}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc`);
}