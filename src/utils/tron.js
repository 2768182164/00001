import { TronWeb } from 'tronweb';

export const NETWORKS = {
  mainnet: {
    name: '主网',
    fullHost: 'https://api.trongrid.io',
    chainId: '1'
  },
  nile: {
    name: 'Nile 测试网',
    fullHost: 'https://nile.trongrid.io',
    chainId: '0xcd8690ce'
  }
};

export const DEFAULT_NETWORK = 'nile';

let tronWebInstance = null;

export function createTronWeb(network = DEFAULT_NETWORK) {
  const config = NETWORKS[network] || NETWORKS[DEFAULT_NETWORK];

  tronWebInstance = new TronWeb({
    fullHost: config.fullHost
  });

  return tronWebInstance;
}

export function getTronWeb() {
  if (!tronWebInstance) {
    return createTronWeb();
  }
  return tronWebInstance;
}

export function isValidAddress(address) {
  // 确保 TronWeb 已初始化
  if (!tronWebInstance) {
    createTronWeb();
  }

  // 尝试使用 TronLink 的 tronWeb 验证地址
  if (window.tronLink?.tronWeb?.isAddress) {
    return window.tronLink.tronWeb.isAddress(address);
  }

  // 使用本地 TronWeb 验证
  return tronWebInstance ? tronWebInstance.isAddress(address) : false;
}

export function fromSun(sun) {
  if (!tronWebInstance) createTronWeb();
  return tronWebInstance ? String(tronWebInstance.fromSun(sun)) : '0';
}

export function toSun(trx) {
  if (!tronWebInstance) createTronWeb();
  return tronWebInstance ? Number(tronWebInstance.toSun(trx)) : 0;
}

export async function getBalance(address) {
  const tronWeb = getTronWeb();
  const balance = await tronWeb.trx.getBalance(address);
  return fromSun(balance);
}

export { TronWeb };