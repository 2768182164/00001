# Tron DApp

基于 Vue 3 + Vite 构建的 Tron 波场链 DApp，使用 TronWeb 进行波场链交互。

## 功能特性

- 💰 **钱包连接** - 支持通过 TronLink 连接波场钱包
- 🔄 **TRX 转账** - 原生 TRX 代币转账功能
- 🪙 **代币转账** - 支持 TRC20 代币转账
- 📱 **响应式设计** - 适配移动端和桌面端

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 8
- **状态管理**: Pinia 3
- **UI 组件库**: Vant 4
- **区块链交互**: TronWeb 6
- **样式**: CSS

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
tron-dapp/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/     # Vue 组件
│   │   ├── ContractPanel.vue
│   │   ├── HelloWorld.vue
│   │   ├── TokenTransfer.vue
│   │   ├── TrxTransfer.vue
│   │   └── WalletConnect.vue
│   ├── composables/    # 组合式函数
│   │   ├── useContract.js
│   │   ├── useTokenTransfer.js
│   │   ├── useTrxTransfer.js
│   │   └── useTronLink.js
│   ├── stores/         # Pinia 状态管理
│   │   └── wallet.js
│   ├── utils/          # 工具函数
│   │   └── tron.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── public/
├── vite.config.js
└── package.json
```

## 使用说明

1. **连接钱包** - 点击"连接钱包"按钮，使用 TronLink 扩展程序或 mobile 钱包扫码授权
2. **TRX 转账** - 进入 TRX 转账页面，输入收款地址和金额，确认转账
3. **代币转账** - 进入代币转账页面，选择代币类型，输入收款地址和金额，确认转账

## 注意事项

- 确保已安装 TronLink 浏览器扩展或使用 TronLink Mobile
- 转账前请仔细核对收款地址
- 主网测试请确保网络配置正确

## License

MIT
