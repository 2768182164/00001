<script setup>
import { ref } from 'vue';
import 'vant/lib/index.css';
import WalletConnect from './components/WalletConnect.vue';
import TrxTransfer from './components/TrxTransfer.vue';
import TokenTransfer from './components/TokenTransfer.vue';
import ContractPanel from './components/ContractPanel.vue';

const activeTab = ref(0);
const tabs = ['钱包', 'TRX转账', '代币', '合约'];
</script>

<template>
  <div class="app">
    <van-nav-bar title="TRON DApp" />

    <van-tabs v-model:active="activeTab">
      <van-tab :title="tabs[0]">
        <WalletConnect />
      </van-tab>
      <van-tab :title="tabs[1]">
        <TrxTransfer />
      </van-tab>
      <van-tab :title="tabs[2]">
        <TokenTransfer />
      </van-tab>
      <van-tab :title="tabs[3]">
        <ContractPanel />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}
.app {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>