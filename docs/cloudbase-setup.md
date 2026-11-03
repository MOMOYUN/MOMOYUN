# 云环境部署

AppID：wxa945ff67e92028f0；环境：luna-d4gsa16d63765d1fb。

小程序启动时初始化 wx.cloud，traceUser 关闭。health 与 event 均已部署。

安装两端依赖后，在根目录运行 npm run build:functions 和 npm run build:miniapp。用微信开发者工具导入本工程根目录。上传 event 时选择“云端安装依赖”，部署内容入口为生成的 index.js，业务源代码为 handler.ts/service.ts 及 packages/lottery-core。

修改源代码后必须重新运行 build:functions。CLI 部署命令：

    cli cloud functions deploy --env luna-d4gsa16d63765d1fb --names event --remote-npm-install --project <工程根目录>

首次创建函数时可能先进入 Creating 状态；确认 Active 后重试部署，不要把第一次创建确认当作代码已更新成功。

用户已手动登录开发者工具并开启服务端口；不要把登录票据或本机私有配置提交到仓库。

event 首次创建活动时建立 lottery_events 集合。迁移至其他环境时，必须重新验证客户端直读和直写都被拒绝，再使用真实名单。网页大屏尚未接入，禁止为方便同步而开放此集合。
