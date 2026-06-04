<template>
  <div class="trx-transfer">
    <van-cell-group inset>
      <van-field
        v-model="toAddress"
        :label="t('trx.toAddress')"
        :placeholder="t('trx.toAddressPlaceholder')"
        :error-message="addressError"
      />
      <van-field
        v-model.number="amount"
        :label="t('trx.amount')"
        type="number"
        :placeholder="t('trx.amountPlaceholder')"
        :error-message="amountError"
      />
    </van-cell-group>

    <div class="transfer-btn">
      <van-button
        type="primary"
        size="large"
        :loading="isSending"
        :disabled="!canTransfer"
        @click="showConfirmDialog"
      >
        {{ waitingConfirm ? t('common.waiting') : (isSending ? t('trx.transferring') : t('trx.confirmTransfer')) }}
      </van-button>
    </div>

    <p v-if="error" style="color: #f00; margin-top: 10px;">{{ error }}</p>

    <!-- 确认弹窗 -->
    <van-dialog v-model:show="showConfirm" :title="t('trx.confirmTransfer')" show-cancel-button @confirm="doTransfer">
      <p style="padding: 20px; text-align: center;">
        <van-icon name="warning" color="#ff976a" size="40" />
        <p style="margin-top: 10px;">
          {{ t('trx.transferTo', { amount, address: shortToAddress }) }}
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { isValidAddress, toSun } from '../utils/tron';
import { useWalletStore } from '../stores/wallet';
import { useTrxTransfer } from '../composables/useTrxTransfer';

const { t } = useI18n();
const walletStore = useWalletStore();
const { isSending, txHash, error, transfer } = useTrxTransfer();

const toAddress = ref('');
const amount = ref('');
const showConfirm = ref(false);
const showResult = ref(false);
const waitingConfirm = ref(false);

const addressError = computed(() => {
  if (!toAddress.value) return '';
  return isValidAddress(toAddress.value) ? '' : t('trx.invalidAddress');
});

const amountError = computed(() => {
  if (!amount.value) return '';
  return amount.value > 0 ? '' : t('trx.amountMustBePositive');
});

const canTransfer = computed(() => {
  return isValidAddress(toAddress.value) && amount.value > 0;
});

const shortToAddress = computed(() => {
  if (!toAddress.value) return '';
  return toAddress.value.slice(0, 6) + '...' + toAddress.value.slice(-4);
});

const shortTxHash = computed(() => {
  if (!txHash.value) return '';
  return txHash.value.slice(0, 8) + '...' + txHash.value.slice(-8);
});

function showConfirmDialog() {
  if (!canTransfer.value) return;
  showConfirm.value = true;
}

async function doTransfer() {
  showConfirm.value = false;
  waitingConfirm.value = true;

  const result = await transfer(toAddress.value, amount.value);

  waitingConfirm.value = false;

  if (!result && error.value) {
    showResult.value = true;
    return;
  }

  if (result) {
    showResult.value = true;
  }
}

function openExplorer() {
  const url = walletStore.network === 'nile'
    ? `https://nile.tronscan.org/#/transaction/${txHash.value}`
    : `https://tronscan.org/#/transaction/${txHash.value}`;
  window.open(url, '_blank');
}
</script>

<style scoped>
.trx-transfer { padding: 16px; }
.transfer-btn { margin-top: 20px; }
</style>
