<template>
  <div class="contract-panel">
    <van-cell-group inset>
      <van-field
        v-model="contractAddress"
        :label="t('contract.contractAddress')"
        :placeholder="t('contract.contractPlaceholder')"
        :error-message="addressError"
      />
      <van-field
        v-model="methodName"
        :label="t('contract.methodName')"
        :placeholder="t('contract.methodPlaceholder')"
      />
      <van-field
        v-model="methodParams"
        :label="t('contract.params')"
        type="textarea"
        :placeholder="t('contract.paramsPlaceholder')"
        rows="3"
      />
    </van-cell-group>

    <div class="action-btns">
      <van-button type="primary" size="large" :loading="isLoading" @click="handleCall">
        {{ t('contract.callQuery') }}
      </van-button>
      <van-button type="warning" size="large" :loading="isLoading" @click="handleSend">
        {{ t('contract.sendTransaction') }}
      </van-button>
    </div>

    <van-cell-group v-if="result" :title="t('contract.result')" inset>
      <van-cell>
        <pre class="result-content">{{ result }}</pre>
      </van-cell>
    </van-cell-group>

    <van-cell-group v-if="error" :title="t('contract.error')" inset>
      <van-cell>
        <div class="error-content">{{ error }}</div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { isValidAddress } from '../utils/tron';
import { useContract } from '../composables/useContract';

const { t } = useI18n();
const { isLoading, result, error, callConstant, sendTransaction } = useContract();

const contractAddress = ref('');
const methodName = ref('');
const methodParams = ref('');

const addressError = computed(() => {
  if (!contractAddress.value) return '';
  return isValidAddress(contractAddress.value) ? '' : t('contract.invalidContract');
});

function parseParams() {
  if (!methodParams.value) return [];
  try {
    return JSON.parse(methodParams.value);
  } catch {
    return methodParams.value.split(',').map(s => s.trim());
  }
}

async function handleCall() {
  const params = parseParams();
  await callConstant(contractAddress.value, methodName.value, params);
}

async function handleSend() {
  const params = parseParams();
  await sendTransaction(contractAddress.value, methodName.value, params);
}
</script>

<style scoped>
.contract-panel {
  padding: 16px;
}
.action-btns {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.result-content {
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 12px;
}
.error-content {
  color: #ee0a24;
  font-size: 12px;
}
</style>
