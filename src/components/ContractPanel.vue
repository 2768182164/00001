<template>
  <div class="contract-panel">
    <van-cell-group inset>
      <van-field
        v-model="contractAddress"
        label="合约地址"
        placeholder="输入合约地址"
        :error-message="addressError"
      />
      <van-field
        v-model="methodName"
        label="方法名"
        placeholder="输入要调用的方法名"
      />
      <van-field
        v-model="methodParams"
        label="参数"
        type="textarea"
        placeholder="JSON 数组格式，如: ['param1', 'param2']"
        rows="3"
      />
    </van-cell-group>

    <div class="action-btns">
      <van-button type="primary" size="large" :loading="isLoading" @click="handleCall">
        调用查询
      </van-button>
      <van-button type="warning" size="large" :loading="isLoading" @click="handleSend">
        发送交易
      </van-button>
    </div>

    <van-cell-group v-if="result" title="返回结果" inset>
      <van-cell>
        <pre class="result-content">{{ result }}</pre>
      </van-cell>
    </van-cell-group>

    <van-cell-group v-if="error" title="错误" inset>
      <van-cell>
        <div class="error-content">{{ error }}</div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { isValidAddress } from '../utils/tron';
import { useContract } from '../composables/useContract';

const { isLoading, result, error, callConstant, sendTransaction } = useContract();

const contractAddress = ref('');
const methodName = ref('');
const methodParams = ref('');

const addressError = computed(() => {
  if (!contractAddress.value) return '';
  return isValidAddress(contractAddress.value) ? '' : '无效的合约地址';
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