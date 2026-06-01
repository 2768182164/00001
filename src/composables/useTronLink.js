import { ref } from 'vue';

// 检测 TronLink
export function checkTronLink() {
  return typeof window !== 'undefined' && !!window.tronLink;
}

// 获取提供商的函数
function getProvider() {
  return window.tronLink || null;
}

export function useTronLink() {
  const isInstalled = ref(false);
  const error = ref('');

  async function checkTronLink() {
    isInstalled.value = !!getProvider();
    return isInstalled.value;
  }

  // 连接钱包 - 使用推荐的 tron_requestAccounts 方法
  async function requestAccounts() {
    error.value = '';
    const provider = getProvider();

    if (!provider) {
      error.value = '请先安装 TronLink 钱包';
      return null;
    }

    try {
      // 使用推荐的 API 获取账户
      const result = await provider.request({ method: 'tron_requestAccounts' });
      console.log('tron_requestAccounts result:', result);

      // 解析响应
      let address = null;

      if (Array.isArray(result) && result.length > 0) {
        address = result[0];
      } else if (result && result.code === 200) {
        // 授权成功，从 tronWeb 获取地址
        address = provider.tronWeb?.defaultAddress?.base58 || null;
      }

      return address;
    } catch (e) {
      error.value = e.message || '请求授权失败';
      return null;
    }
  }

  // 断开连接
  function disconnect() {
    error.value = '';
  }

  return {
    isInstalled,
    error,
    checkTronLink,
    requestAccounts,
    disconnect
  };
}