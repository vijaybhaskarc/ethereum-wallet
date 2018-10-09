import ethers from 'ethers';

const { utils } = ethers;

const DEFAULT_GASLIMIT = 21000;
// const DEFAULT_GASLIMIT = 200000;
const DEFAULT_GASPRICE = 4000000000; // 4 gwei
// const DEFAULT_GASPRICE = 60000000000; // 60 gwei

const DEFAULT_ERC20_GASLIMIT = 200000;
const DEFAULT_ERC20_GASPRICE = 3500000000;


export function createTransaction(to, value, gasLimit = DEFAULT_GASLIMIT, options = {}) {
  if (!value) throw new Error('The transaction value is required.');
  else if (!(Number(value) > 0)) throw new Error('The transaction value is invalid.');
  const gasPrice = DEFAULT_GASPRICE;
  value = utils.parseEther(value);
  return { gasPrice, ...options, to, gasLimit, value };
}

export function createERC20Transaction(to, amount, value, gasLimit = DEFAULT_ERC20_GASLIMIT, options = {}) {
  const gasPrice = DEFAULT_ERC20_GASPRICE;
  return { gasPrice, ...options, to, gasLimit, amount, value };
}

export function isValidTransaction(transaction) {
  return transaction instanceof Object
    && Number(transaction.value) > 0 && Number(transaction.gasLimit) > 0 && typeof transaction.to === 'string';
}

export function isValidERC20Transaction(transaction) {
  return transaction instanceof Object
    && Number(transaction.gasLimit) > 0 && typeof transaction.to === 'string';
}