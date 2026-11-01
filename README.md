# 随机一下 V0.11

本地工程化第一批，尚未上线。

Node 24；分别在 apps/miniapp 与 apps/display 执行 npm ci；根目录 npm test；npm run build:miniapp；npm run build:display。小程序产物位于 apps/miniapp/dist/build/mp-weixin。填入 manifest.json 的真实微信 AppID 后用微信开发者工具导入。

本轮范围与剩余任务见 docs/release-checklist.md；数据与服务端约束见 docs/architecture.md。大屏和小程序目前均明确展示未连接状态，不生成虚假的云端结果。

uni-app 模板来源：https://github.com/dcloudio/uni-preset-vue/tree/vite-ts ，模板来源与版本见 docs/validation.md。
