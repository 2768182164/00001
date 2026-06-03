# Tron DApp

English | [简体中文](#简体中文)

A Tron DApp built with Vue 3 + Vite, using TronWeb for blockchain interactions. Supports English and Chinese (default: English).

## Features

- 💰 **Wallet Connect** — Connect to TronLink wallet
- 🔄 **TRX Transfer** — Native TRX token transfers
- 🪙 **Token Transfer** — TRC20 token transfers
- 📜 **Contract Panel** — Call contract methods / send contract transactions
- 🌐 **i18n** — English / 中文, runtime switchable, persisted in `localStorage`
- 📱 **Responsive** — Mobile and desktop friendly

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 8
- **State Management**: Pinia 3
- **UI Library**: Vant 4
- **i18n**: vue-i18n 9
- **Blockchain**: TronWeb 6
- **Node**: ≥ 16 (recommended ≥ 22)

## Quick Start

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```text
tron-dapp/
├── src/
│   ├── assets/             # Static assets
│   ├── components/         # Vue components
│   │   ├── ContractPanel.vue
│   │   ├── HelloWorld.vue
│   │   ├── TokenTransfer.vue
│   │   ├── TrxTransfer.vue
│   │   └── WalletConnect.vue
│   ├── composables/        # Composition functions
│   │   ├── useContract.js
│   │   ├── useTokenTransfer.js
│   │   ├── useTrxTransfer.js
│   │   └── useTronLink.js
│   ├── i18n/               # Internationalization
│   │   ├── en.js           # English messages
│   │   ├── zh.js           # Chinese messages
│   │   └── index.js        # i18n config (default: en)
│   ├── stores/             # Pinia stores
│   │   └── wallet.js
│   ├── utils/              # Utilities
│   │   └── tron.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── public/
├── vite.config.js
└── package.json
```

## Usage

1. **Connect Wallet** — Click "Connect Wallet" and authorize via TronLink extension or mobile wallet
2. **TRX Transfer** — Go to TRX Transfer tab, enter recipient address and amount, confirm
3. **Token Transfer** — Go to Token tab, pick a token, enter recipient address and amount, confirm
4. **Contract** — Enter contract address, method name and JSON params, then call or send
5. **Switch Language** — Tap the language icon on the top-right of the nav bar

### Adding a new language

1. Create `src/i18n/<locale>.js` with the same shape as `en.js`
2. Register it in `src/i18n/index.js` (add to `messages` and `SUPPORTED_LOCALES`)
3. The language picker in `App.vue` will pick it up automatically

## Notes

- Install the TronLink browser extension or use TronLink Mobile
- Double-check the recipient address before transferring
- Confirm network configuration when testing on mainnet

## License

MIT

---

## 简体中文

[English](#tron-dapp) | 简体中文

基于 Vue 3 + Vite 构建的 Tron 波场链 DApp，使用 TronWeb 进行链上交互。支持中英双语，默认英文。

### 功能特性

- 💰 **钱包连接** — 通过 TronLink 连接波场钱包
- 🔄 **TRX 转账** — 原生 TRX 代币转账
- 🪙 **代币转账** — TRC20 代币转账
- 📜 **合约面板** — 调用合约方法 / 发送合约交易
- 🌐 **多语言** — 中英文运行时切换，选项写入 `localStorage`
- 📱 **响应式设计** — 适配移动端和桌面端

### 技术栈

- **前端框架**：Vue 3（Composition API）
- **构建工具**：Vite 8
- **状态管理**：Pinia 3
- **UI 组件库**：Vant 4
- **国际化**：vue-i18n 9
- **链上交互**：TronWeb 6
- **Node 版本**：≥ 16（推荐 ≥ 22）

### 快速开始

#### 安装依赖

```bash
npm install
```

#### 开发模式

```bash
npm run dev
```

#### 构建生产版本

```bash
npm run build
```

#### 预览生产版本

```bash
npm run preview
```

### 项目结构

```text
tron-dapp/
├── src/
│   ├── assets/             # 静态资源
│   ├── components/         # Vue 组件
│   │   ├── ContractPanel.vue
│   │   ├── HelloWorld.vue
│   │   ├── TokenTransfer.vue
│   │   ├── TrxTransfer.vue
│   │   └── WalletConnect.vue
│   ├── composables/        # 组合式函数
│   │   ├── useContract.js
│   │   ├── useTokenTransfer.js
│   │   ├── useTrxTransfer.js
│   │   └── useTronLink.js
│   ├── i18n/               # 国际化
│   │   ├── en.js           # 英文翻译
│   │   ├── zh.js           # 中文翻译
│   │   └── index.js        # i18n 配置（默认英文）
│   ├── stores/             # Pinia 状态管理
│   │   └── wallet.js
│   ├── utils/              # 工具函数
│   │   └── tron.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── public/
├── vite.config.js
└── package.json
```

### 使用说明

1. **连接钱包** — 点击 "Connect Wallet / 连接钱包"，通过 TronLink 扩展或移动端钱包授权
2. **TRX 转账** — 进入 TRX 转账页，输入收款地址和金额，确认转账
3. **代币转账** — 进入代币页，选择代币，输入收款地址和金额，确认转账
4. **合约调用** — 输入合约地址、方法名和 JSON 参数，调用查询或发送交易
5. **切换语言** — 点击导航栏右上角的语言图标

#### 新增语言

1. 在 `src/i18n/` 下新建 `<语言代码>.js`，结构与 `en.js` 一致
2. 在 `src/i18n/index.js` 中注册（加入 `messages` 和 `SUPPORTED_LOCALES`）
3. `App.vue` 的语言选择器会自动识别

### 注意事项

- 请先安装 TronLink 浏览器扩展或 TronLink Mobile
- 转账前请仔细核对收款地址
- 主网测试请确认网络配置正确

### 许可证

MIT
