import { ref } from 'vue';
import { toSun, isValidAddress } from '../utils/tron';
import { useWalletStore } from '../stores/wallet';

export function useTrxTransfer() {
  const walletStore = useWalletStore();
  const isSending = ref(false);
  const txHash = ref('');
  const error = ref('');

  async function transfer(to, amount) {
    error.value = '';
    txHash.value = '';
    isSending.value = true;

    try {
      if (!isValidAddress(to)) {
        error.value = '无效的目标地址';
        return null;
      }

      const amountSun = toSun(amount);
      if (amountSun <= 0) {
        error.value = '转账金额必须大于 0';
        return null;
      }

      const provider = window.tronLink;
      if (!provider?.tronWeb) {
        error.value = 'TronLink 未连接';
        return null;
      }

      await provider.request({ method: 'tron_requestAccounts' });

      const result = await provider.tronWeb.trx.sendTransaction(to, amountSun);
      txHash.value = result.txid;

      // 更新余额
      await provider.tronWeb.trx.getBalance(provider.tronWeb.defaultAddress.base58).then(balance => {
        walletStore.balance = String(provider.tronWeb.fromSun(balance));
      });

      return result.txid;
    } catch (e) {
      error.value = e.message || '转账失败';
      console.error('转账错误:', e);
      return null;
    } finally {
      isSending.value = false;
    }
  }

  return {
    isSending,
    txHash,
    error,
    transfer
  };
}