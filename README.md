# BiliChromePlugin
官方发布的适用于 BiliScape (BiliChrome) 的JS插件   

## 脚本列表
- [一键跳过恰饭片段](./plugins/BiliSponsorSkip/)
- [播放器触摸屏手势](./plugins/VideoGesture/)

## JS插件导入教程
1. 从该仓库中下载js文件，保存到本地
2. 打开BiliScape主界面后，进入“我的”页面，在下方找到“导入JS插件”，点击箭头
3. 选择要导入的JS文件
4. 如果有安全检查确认对话框，阅读后点击确认
5. Ctrl+R 或 重新打开BiliScape窗口，在第二次确认运行后，脚本开始正常工作

## 开发者提示
1. JS插件只支持ES5规范，即不能用`()=>{}`、` `` `、`const`、`let`、`class`、`promise`之类的语法。
2. JS插件的输出和调试内容都在F12开发者工具中
3. JS插件避免引用外部资源，避免压缩代码
4. JS插件可以使用jQuery
   
**注：** 当前脚本仅支持 BiliScape v3.3.0 及以上版本，原因在于该版本重构了部分代码，导致一些全局变量不通用   
   
## 开发计划
- 修改默认启动页面插件
- 支持手柄操作的插件