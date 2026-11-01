# 验证记录

2026-11-01，Windows，Node v24.22.1。

- 7 项 Node 原生测试通过：跨奖项/批次去重、规则输入隔离、状态流转、非法配置、权重区间、身份/版本校验、停止请求重试。
- 大屏 Vite production build 通过。
- 小程序 uni build -p mp-weixin 通过，产物为 apps/miniapp/dist/build/mp-weixin；后续已填入用户提供的真实 AppID 和云环境 ID 并重新构建通过，不能作为已上线证明。
- 小程序 vue-tsc --noEmit 通过。
- 服务层测试使用内存 Repository；CloudBase Repository 适配器、真实事务、云端部署均未实现，不能据此宣称云端并发安全已验证。
- 未执行微信真机测试、跨设备同步或视觉验收；尚未提交审核或发布。

模板来源：dcloudio/uni-preset-vue，vite-ts 分支，commit f747e3b11c51b3bff6c05e2b54f9a3173a590044。依赖首次安装后由各端 package-lock.json 锁定。

参考官方资料：

- https://uniapp.dcloud.net.cn/quickstart-cli
- https://docs.cloudbase.net/database/transaction

生产接入前必须将随机源设为服务端加密随机源，并实现 OPENID 校验、原子提交、请求去重和只读大屏授权。

云环境验证补充：2026-11-01 22:21（Asia/Shanghai），微信开发者工具 v2.02.2609240，health 云函数上传成功，模拟器真实调用通过。仅验证云端连接，不代表抽奖服务、真机或大屏联调通过。
