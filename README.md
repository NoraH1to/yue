# Yue

尽量简单的阅读器

## Features

- 最强大的跨平台能力（浏览器）

- PWA

- i18n

- webDAV

- 标签分类

![](./res/book_list.png)
![](./res/book_detail.png)
![](./res/webdav_list.png)

## RoadMap

肯定会做

- [ ] 字体调整（间距、大小等）

- [ ] 优化体积，有点膨胀（`@mui/icons-material`）

看需求

- [ ] 支持漫画（压缩包格式）

看心情

- [ ] 更多的 Source（OneDrive 之类的）

## Why

最近入手了人生第二台 iOS 设备，AppStore 上的阅读器要么只能本地导入，要么得加钱

得，我自己写一个

## Issue

### 跨域限制

所有 WebApp 都绕不开的问题，大多数 webDAV 服务都没法用

我个人用使用 [`alist`](https://github.com/alist-org/alist) 搭建私有服务解决

### 无法翻页

在以下操作后小概率无法翻页，`epub.js` 的锅

- 频繁缩放窗口

- 非常频繁的翻页（已做节流，基本不会有问题）

### 跳转页面误差

跳转到指定页面会有 `+/-1` 页的误差，`epub.js` 的 `cfi` 实现问题

### 渲染错位

仅在安卓手机上出现，具体表现每次翻页后页面会偏移 `1~2px`，原因未知（我猜也是 `epub.js` 的问题）
