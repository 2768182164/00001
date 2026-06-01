<template>
  <div class="trx-transfer">
    <van-cell-group inset>
      <van-field
        v-model="toAddress"
        label="收款地址"
        placeholder="请输入 TRON 地址"
        :error-message="addressError"
      />
      <van-field
        v-model.number="amount"
        label="转账金额"
        type="number"
        placeholder="请输入 TRX 数量"
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
        {{ waitingConfirm ? '等待确认...' : (isSending ? '转账中...' : '确认转账') }}
      </van-button>
    </div>

    <p v-if="error" style="color: #f00; margin-top: 10px;">{{ error }}</p>

    <!-- 确认弹窗 -->
    <van-dialog v-model:show="showConfirm" title="确认转账" show-cancel-button @confirm="doTransfer">
      <p style="padding: 20px; text-align: center;">
        <van-icon name="warning" color="#ff976a" size="40" />
        <p style="margin-top: 10px;">
          转账 {{ amount }} TRX 给 {{ shortToAddress }}
        </p>
      </p>
    </van-dialog>

    <!-- 结果弹窗 -->
    <van-dialog v-model:show="showResult" :title="txHash ? '转账成功' : '转账失败'">
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
          在浏览器查看
        </van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { isValidAddress, toSun } from '../utils/tron';
import { useWalletStore } from '../stores/wallet';
import { useTrxTransfer } from '../composables/useTrxTransfer';

const walletStore = useWalletStore();
const { isSending, txHash, error, transfer } = useTrxTransfer();

const toAddress = ref('');
const amount = ref('');
const showConfirm = ref(false);
const showResult = ref(false);
const waitingConfirm = ref(false);

const addressError = computed(() => {
  if (!toAddress.value) return '';
  return isValidAddress(toAddress.value) ? '' : '无效的 TRON 地址';
});

const amountError = computed(() => {
  if (!amount.value) return '';
  return amount.value > 0 ? '' : '金额必须大于 0';
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