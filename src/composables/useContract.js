import { ref } from 'vue';
import { getTronWeb, isValidAddress } from '../utils/tron';

export function useContract() {
  const isLoading = ref(false);
  const result = ref('');
  const error = ref('');

  async function callConstant(contractAddress, method, params = []) {
    error.value = '';
    result.value = '';
    isLoading.value = true;

    try {
      if (!isValidAddress(contractAddress)) {
        error.value = '无效的合约地址';
        return null;
      }

      const tronWeb = getTronWeb();
      const contract = await tronWeb.contract().at(contractAddress);

      const response = await contract[method](...params).call();
      result.value = JSON.stringify(response, null, 2);
      return response;
    } catch (e) {
      error.value = e.message || '调用失败';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function sendTransaction(contractAddress, method, params = [], options = {}) {
    error.value = '';
    result.value = '';
    isLoading.value = true;

    try {
      if (!isValidAddress(contractAddress)) {
        error.value = '无效的合约地址';
        return null;
      }

      const tronWeb = getTronWeb();
      const contract = await tronWeb.contract().at(contractAddress);

      const tx = await contract[method](...params).send(options);
      result.value = tx;
      return tx;
    } catch (e) {
      error.value = e.message || '交易失败';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    result,
    error,
    callConstant,
    sendTransaction
  };
}