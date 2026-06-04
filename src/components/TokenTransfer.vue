<template>
  <div class="token-transfer">
    <van-tabs v-model:active="activeTab">
      <van-tab :title="t('token.transferTab')">
        <van-cell-group inset>
          <van-field
            v-model="tokenAddress"
            :label="t('token.contractAddress')"
            :placeholder="t('token.contractPlaceholder')"
            :error-message="tokenError"
          />
          <van-cell :title="t('token.tokenName')" :value="tokenInfo.name || '-'" />
          <van-cell :title="t('token.tokenSymbol')" :value="tokenInfo.symbol || '-'" />
          <van-cell :title="t('token.decimals')" :value="tokenInfo.decimals?.toString() || '-'" />
          <van-cell :title="t('token.balance')" :value="tokenBalance" />
          <van-field
            v-model="toAddress"
            :label="t('token.toAddress')"
            :placeholder="t('token.toAddressPlaceholder')"
            :error-message="addressError"
          />
          <van-field
            v-model.number="amount"
            :label="t('token.amount')"
            type="number"
            :placeholder="t('token.amountPlaceholder')"
          />
        </van-cell-group>

        <div class="action-btns">
          <van-button size="small" @click="queryBalance">{{ t('token.queryBalance') }}</van-button>
          <van-button
            type="primary"
            size="large"
            :loading="isSending"
            :disabled="!canTransfer"
            @click="showConfirmDialog"
          >
            {{ waitingConfirm ? t('common.waiting') : (isSending ? t('token.transferring') : t('token.confirmTransfer')) }}
          </van-button>
        </div>

        <p v-if="error" style="color: #f00; margin-top: 10px;">{{ error }}</p>
      </van-tab>

      <van-tab :title="t('token.manageTab')">
        <van-cell-group inset>
          <van-cell
            v-for="token in savedTokens"
            :key="token.address"
            :title="token.symbol"
            :value="token.address.slice(0, 6) + '...'"
            is-link
            @click="selectToken(token)"
          />
        </van-cell-group>
        <van-button type="primary" block @click="showAddTokenDialog = true">{{ t('token.addToken') }}</van-button>
      </van-tab>
    </van-tabs>

    <!-- 确认弹窗 -->
    <van-dialog v-model:show="showConfirm" :title="t('token.confirmTransfer')" show-cancel-button @confirm="doTransfer">
      <p style="padding: 20px; text-align: center;">
        <van-icon name="warning" color="#ff976a" size="40" />
        <p style="margin-top: 10px; font-size: 14px; white-space: pre-line;">
          {{ t('token.confirmInfo', { symbol: tokenInfo.symbol, amount, address: shortToAddress }) }}
        </p>
      </p>
    </van-dialog>

    <!-- 结果弹窗 -->
    <van-dialog v-model:show="showResult" :title="txHash ? t('common.transferSuccess') : t('common.transferFailed')">
      <div style="padding: 20px; text-align: center;">
        <van-icon v-if="txHash" name="checked" color="#07c160" size="40" />
        <van-icon v-else name="cross" color="#f00" size="40" />

        <p v-if="txHash" style="margin-top: 10px; font-size: 12px; word-break: break-all;">
          {{ shortTxHash }}
        </p>
        <p v-else style="color: #f00; margin-top: 10px;">
          {{ error }}
        </p>

        <van-button v-if="txHash" type="primary" size="small" style="margin-top: 10px;" @click="openExplorer">
          {{ t('common.viewInExplorer') }}
        </van-button>
      </div>
    </van-dialog>

    <!-- 添加代币弹窗 -->
    <van-dialog v-model:show="showAddTokenDialog" :title="t('token.addToken')" show-cancel-button @confirm="addToken">
      <van-field v-model="newTokenAddress" :placeholder="t('token.addTokenPlaceholder')" />
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { isValidAddress } from '../utils/tron';
import { useWalletStore } from '../stores/wallet';
import { useTokenTransfer } from '../composables/useTokenTransfer';

const { t } = useI18n();
const walletStore = useWalletStore();
const { isSending, txHash, error, getTokenBalance, getTokenInfo, transfer } = useTokenTransfer();

const activeTab = ref(0);
const tokenAddress = ref('');
const toAddress = ref('');
const amount = ref('');
const showConfirm = ref(false);
const showResult = ref(false);
const showAddTokenDialog = ref(false);
const newTokenAddress = ref('');
const waitingConfirm = ref(false);
const savedTokens = ref([
  { address: 'TN7sCNtGqruQLiRmuNaX4mVt5XqDB3hq', symbol: 'USDD' },
  { address: 'TJz7wP4ixLhNNGJ6C1x5MxJ6', symbol: 'USDT' }
]);

const tokenInfo = reactive({ name: '', symbol: '', decimals: 6 });
const tokenBalance = ref('-');

const tokenError = computed(() => {
  if (!tokenAddress.value) return '';
  return isValidAddress(tokenAddress.value) ? '' : t('token.invalidContract');
});

const addressError = computed(() => {
  if (!toAddress.value) return '';
  return isValidAddress(toAddress.value) ? '' : t('token.invalidAddress');
});

const canTransfer = computed(() => {
  return isValidAddress(tokenAddress.value) && isValidAddress(toAddress.value) && amount.value > 0;
});

const shortToAddress = computed(() => {
  if (!toAddress.value) return '';
  return toAddress.value.slice(0, 6) + '...' + toAddress.value.slice(-4);
});

const shortTxHash = computed(() => {
  if (!txHash.value) return '';
  return txHash.value.slice(0, 8) + '...' + txHash.value.slice(-8);
});

function formatBalance(balance, decimals) {
  if (!balance || !decimals) return '0';
  try {
    const bn = BigInt(balance);
    const dec = BigInt(decimals);
    const divisor = BigInt(10) ** dec;
    const integerPart = bn / divisor;
    const fractionalPart = bn % divisor;
    const fracStr = fractionalPart.toString().padStart(Number(dec), '0');
    return `${integerPart}.${fracStr}`;
  } catch (e) {
    return String(balance);
  }
}

async function queryBalance() {
  if (!tokenAddress.value || !isValidAddress(tokenAddress.value)) return;
  tokenBalance.value = t('token.querying');
  try {
    const info = await getTokenInfo(tokenAddress.value);
    if (info) {
      Object.assign(tokenInfo, info);
      const rawBalance = await getTokenBalance(tokenAddress.value, walletStore.address);
      tokenBalance.value = formatBalance(rawBalance, tokenInfo.decimals);
    }
  } catch (e) {
    console.error('queryBalance failed:', e);
    tokenBalance.value = t('token.queryFailed');
  }
}

function showConfirmDialog() {
  if (!canTransfer.value) return;
  showConfirm.value = true;
}

async function doTransfer() {
  showConfirm.value = false;
  waitingConfirm.value = true;

  const result = await transfer(tokenAddress.value, toAddress.value, amount.value, tokenInfo.decimals);

  waitingConfirm.value = false;

  if (!result) {
    if (error.value) {
      showResult.value = true;
    }
    return;
  }

  await queryBalance();
  showResult.value = true;
}

function openExplorer() {
  const url = `https://nile.tronscan.org/#/transaction/${txHash.value}`;
  window.open(url, '_blank');
}

function selectToken(token) {
  tokenAddress.value = token.address;
  const saved = savedTokens.value.find(item => item.address === token.address);
  if (saved) {
    tokenInfo.symbol = saved.symbol;
  }
  queryBalance();
}

function addToken() {
  if (!newTokenAddress.value || !isValidAddress(newTokenAddress.value)) return;
  savedTokens.value.push({ address: newTokenAddress.value, symbol: 'Token' });
  newTokenAddress.value = '';
  showAddTokenDialog.value = false;
}
</script>

<style scoped>
.token-transfer { padding: 16px; }
.action-btns { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
</style>
