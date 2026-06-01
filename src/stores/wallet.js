import { defineStore } from 'pinia';
import { ref as refVal, computed } from 'vue';
import { getTronWeb, fromSun } from '../utils/tron';

export const useWalletStore = defineStore('wallet', () => {
  const address = refVal('');
  const balance = refVal('0');
  const network = refVal('nile');
  const isConnected = refVal(false);
  const isConnecting = refVal(false);

  const shortAddress = computed(() => {
    if (!address.value) return '';
    return address.value.slice(0, 6) + '...' + address.value.slice(-4);
  });

  async function updateBalance() {
    if (!address.value) return;
    try {
      const tronWeb = getTronWeb();
      const balanceVal = await tronWeb.trx.getBalance(address.value);
      balance.value = fromSun(balanceVal);
    } catch (e) {
      console.error('获取余额失败:', e);
    }
  }

  function setAddress(addr) {
    address.value = addr;
    isConnected.value = !!addr;
  }

  function setNetwork(net) {
    network.value = net;
  }

  function reset() {
    address.value = '';
    balance.value = '0';
    isConnected.value = false;
  }

  return {
    address,
    balance,
    network,
    isConnected,
    isConnecting,
    shortAddress,
    updateBalance,
    setAddress,
    setNetwork,
    reset
  };
});