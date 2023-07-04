# 📚 Yue（阅 yuè）

轻量级 web 阅读器，操作简单，界面干净，专注于阅读

[English](./README.md) | 中文

## ✨ 特性

- 🚀 **跨平台**：你只需要一个浏览器

- 🚀 **PWA**：优秀的离线体验

- 📁 **webDAV**：使用自己的阅读仓库

- 🌏 **i18n**：多语言支持

![](./res/book_list.png)

你可以通过访问部署好的站点来了解更多 [yue.norah1to.com](https://yue.norah1to.com)

## 🧐 为什么

最近入手了人生第二台 iOS 设备，AppStore 上的阅读器要么只能本地导入，要么得加钱

得，我自己写一个

## 🎈 使用指南

### 安装

环境要求 `node >=14 <18`, `pnpm >=7`

```bash
pnpm install
```

### 开发

打开开发服务

```bash
pnpm dev:web
```

访问 `http://localhost:5111`，如果默认端口被占用，请以控制台输出为准

### 打包

可以打包普通的版本

```bash
pnpm build:web
```

或者支持 `PWA` 的版本

```bash
pnpm build:web-pwa
```

打包产物分别在 `dist/web` 和 `dist/web-pwa` 中

## 📍 路线图

罗列出**可能**实现的功能，该项目暂时只需满足我的个人需求（没人用）

- [x] 支持 PDF

- [x] 支持漫画（压缩包格式）

- [ ] 自定义阅读器配色

- [ ] 更多的 Source（OneDrive 之类的）

## 🚧 已知问题

如果有解决方案，欢迎 PR

### 跨域限制

所有 WebApp 都绕不开的问题，大多数 webDAV 服务都没法用

我个人用使用 [`alist`](https://github.com/alist-org/alist) 搭建私有服务解决

- **2023/05/25 更新**

  跨域问题已经通过配置 `vercel.json` 使用反向代理解决了。

  例子：`https://yue.norah1to.com/proxy/my.webdav.server/sub`

  在这种情况下，你需要将目录的自定义根路径配置为正确的根路径，在上面的例子中，我们需要将其配置为 `/sub`

### 无法翻页

在以下操作后小概率无法翻页，`epub.js` 的锅

- 频繁缩放窗口

- 非常频繁的翻页（已做节流，基本不会有问题）

详情在[这里](https://github.com/NoraH1to/yue/issues/1)

### 跳转页面误差

跳转到指定页面会有 `+/-1` 页的误差，`epub.js` 的 `cfi` 实现问题

### 渲染错位

仅在安卓手机上出现，具体表现每次翻页后页面会偏移 `1~2px`，原因未知（我猜也是 `epub.js` 的问题）

## 许可证

[MIT](./LICENSE)
