<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import 'vant/lib/index.css';
import WalletConnect from './components/WalletConnect.vue';
import TrxTransfer from './components/TrxTransfer.vue';
import TokenTransfer from './components/TokenTransfer.vue';
import ContractPanel from './components/ContractPanel.vue';
import { setLocale, SUPPORTED_LOCALES } from './i18n';

const { t, locale } = useI18n();
const activeTab = ref(0);
const showLangPicker = ref(false);

const langColumns = computed(() =>
  SUPPORTED_LOCALES.map(code => ({ text: t(`language.${code}`), value: code }))
);

function onLangConfirm({ selectedValues }) {
  setLocale(selectedValues[0]);
  showLangPicker.value = false;
}
</script>

<template>
  <div class="app">
    <van-nav-bar :title="t('app.title')">
      <template #right>
        <van-icon name="exchange" size="18" @click="showLangPicker = true" />
        <span style="margin-left: 4px; font-size: 12px;">{{ t(`language.${locale}`) }}</span>
      </template>
    </van-nav-bar>

    <van-tabs v-model:active="activeTab">
      <van-tab :title="t('app.tabs.wallet')">
        <WalletConnect />
      </van-tab>
      <van-tab :title="t('app.tabs.trx')">
        <TrxTransfer />
      </van-tab>
      <van-tab :title="t('app.tabs.token')">
        <TokenTransfer />
      </van-tab>
      <van-tab :title="t('app.tabs.contract')">
        <ContractPanel />
      </van-tab>
    </van-tabs>

    <van-popup v-model:show="showLangPicker" position="bottom" round>
      <van-picker
        :title="t('language.label')"
        :columns="langColumns"
        :model-value="[locale]"
        @confirm="onLangConfirm"
        @cancel="showLangPicker = false"
      />
    </van-popup>
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
