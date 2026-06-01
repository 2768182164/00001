<template>
  <div class="wallet-connect">
    <div v-if="!walletStore.isConnected" class="connect-box">
      <van-button type="primary" size="large" :loading="walletStore.isConnecting" @click="connect">
        {{ walletStore.isConnecting ? '连接中...' : '连接钱包' }}
      </van-button>
      <p v-if="errorMsg" style="color: #f00; margin-top: 10px;">{{ errorMsg }}</p>
    </div>

    <div v-else class="wallet-info">
      <van-cell-group inset>
        <van-cell title="地址" :value="walletStore.shortAddress" is-link @click="copyAddress" />
        <van-cell title="余额" :value="walletStore.balance + ' TRX'" />
      </van-cell-group>
      <div style="margin-top: 10px;"></div>
      <van-button type="danger" size="large" block @click="handleDisconnect">
        断开连接
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWalletStore } from '../stores/wallet';

const walletStore = useWalletStore();
const errorMsg = ref('');

async function connect() {
  errorMsg.value = '';
  walletStore.isConnecting = true;

  const provider = window.tronLink;
  if (!provider) {
    errorMsg.value = '请先安装 TronLink 钱包';
    return;
  }

  try {
    const result = await provider.request({ method: 'tron_requestAccounts' });

    let address = null;
    if (Array.isArray(result) && result.length > 0) {
      address = result[0];
    } else if (result && result.code === 200) {
      address = provider.tronWeb?.defaultAddress?.base58 || null;
    }

    if (address) {
      walletStore.setAddress(address);
      if (provider.tronWeb) {
        const balance = await provider.tronWeb.trx.getBalance(address);
        walletStore.balance = String(provider.tronWeb.fromSun(balance));
      }
    } else {
      errorMsg.value = '获取地址失败';
    }
  } catch (e) {
    errorMsg.value = e.message || '连接失败';
  }

  walletStore.isConnecting = false;
}

function handleDisconnect() {
  walletStore.reset();
}

function copyAddress() {
  if (walletStore.address) {
    navigator.clipboard.writeText(walletStore.address);
  }
}

onMounted(() => {
  const provider = window.tronLink;
  if (provider?.tronWeb?.defaultAddress?.base58) {
    walletStore.setAddress(provider.tronWeb.defaultAddress.base58);
    provider.tronWeb.trx.getBalance(provider.tronWeb.defaultAddress.base58).then(balance => {
      walletStore.balance = String(provider.tronWeb.fromSun(balance));
    }).catch(console.error);
  }
});
</script>

<style scoped>
.wallet-connect { padding: 16px; }
.connect-box { margin-top: 20px; }
</style>