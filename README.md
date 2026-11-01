# 随机一下 V0.11

本地工程化第一批，尚未上线。

Node 24；分别在 apps/miniapp 与 apps/display 执行 npm ci；根目录 npm test；npm run build:miniapp；npm run build:display。小程序产物位于 apps/miniapp/dist/build/mp-weixin。已配置微信 AppID 和云环境 ID；用微信开发者工具导入本工程根目录，按 docs/cloudbase-setup.md 部署 health 并验证连接。

本轮范围与剩余任务见 docs/release-checklist.md；数据与服务端约束见 docs/architecture.md。小程序仅在真实调用 health 成功后展示云服务连接成功；抽奖服务和大屏云同步尚未启用。

uni-app 模板来源：https://github.com/dcloudio/uni-preset-vue/tree/vite-ts ，模板来源与版本见 docs/validation.md。
