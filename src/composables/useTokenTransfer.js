import { ref } from 'vue';
import { isValidAddress } from '../utils/tron';
import { useWalletStore } from '../stores/wallet';

const TRC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  }
];

export function useTokenTransfer() {
  const walletStore = useWalletStore();
  const isSending = ref(false);
  const txHash = ref('');
  const error = ref('');

  async function getTokenBalance(tokenAddress, userAddress) {
    const provider = window.tronLink;
    if (!provider?.tronWeb) return '0';

    const contract = await provider.tronWeb.contract(TRC20_ABI, tokenAddress);
    return await contract.balanceOf(userAddress).call();
  }

  async function getTokenInfo(tokenAddress) {
    const provider = window.tronLink;
    if (!provider?.tronWeb) return null;

    const contract = await provider.tronWeb.contract(TRC20_ABI, tokenAddress);
    const [name, symbol, decimals] = await Promise.all([
      contract.name().call(),
      contract.symbol().call(),
      contract.decimals().call()
    ]);
    return { name: name || '', symbol: symbol || '', decimals: parseInt(decimals) || 6 };
  }

  async function transfer(tokenAddress, to, amount, decimals = 6) {
    error.value = '';
    txHash.value = '';
    isSending.value = true;

    try {
      if (!isValidAddress(tokenAddress)) {
        error.value = '无效的代币合约地址';
        return null;
      }
      if (!isValidAddress(to)) {
        error.value = '无效的目标地址';
        return null;
      }

      const provider = window.tronLink;
      if (!provider?.tronWeb) {
        error.value = 'TronLink 未连接';
        return null;
      }

      // 等待用户确认
      const amountWei = parseFloat(amount) * Math.pow(10, decimals);

      // 使用 send 并等待返回结果
      const contract = await provider.tronWeb.contract().at(tokenAddress);
      const result = await contract.transfer(to, amountWei).send({
        feeLimit: 10000000,
        callValue: 0
      });

      // 检查结果是否是交易哈希
      if (result && (result.txid || result.hash || typeof result === 'string')) {
        txHash.value = result.txid || result.hash || result;
        return txHash.value;
      }

      // 如果没有返回有效的交易哈希，说明可能被取消或失败
      if (!txHash.value) {
        error.value = '交易未完成';
        return null;
      }

      return txHash.value;
    } catch (e) {
      // 用户取消时 error 为空，不显示错误
      if (e.message && e.message.includes('cancelled')) {
        error.value = '';
      } else {
        error.value = e.message || '代币转账失败';
      }
      console.error('代币转账错误:', e);
      return null;
    } finally {
      isSending.value = false;
    }
  }

  return {
    isSending,
    txHash,
    error,
    getTokenBalance,
    getTokenInfo,
    transfer
  };
}