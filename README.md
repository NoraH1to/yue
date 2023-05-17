# 📚 Yue（阅 yuè）

Lightweight web reader, easy to use, clean interface, focused on reading

English | [中文](./README_CN.md)

## ✨ Features

- 🚀 **Cross Platform**: All you need is a browser

- 🚀 **PWA**: Excellent offline experience

- 📁 **WebDAV**: Use your own reading library

- 🌏 **I18n**: Multilingual support

![](./res/book_list.png)

You can see more preview images [here](./PREVIEW.md), or visit the deployed site directly [yue.norah1to.com](https://yue.norah1to.com)

## 🧐 Why

I recently got my second iOS device in my life, and the reader on the AppStore can only be imported locally, or you have to pay extra.

Okay, I'll write one myself

## 🎈 Usage Guide

### Install

Environmental requirements `node >=14 <18`, `pnpm >=7`

```bash
pnpm install
```

### Dev

Open Development Services

```bash
pnpm dev:web
```

Visit `http://localhost:5111`, if the default port is occupied, please refer to the console output

### Bundle

You can package the common version

```bash
pnpm build:web
```

or versions with `PWA` support

```bash
pnpm build:web-pwa
```

The packaged products are in `dist/web` and `dist/web-pwa` respectively

## 📍 Road Map

List the functions that **MAYBE** achieve, the project only needs to meet my personal needs for the time being (nobody uses it)

- [ ] PDF support

- [ ] Comic support (zip format)

- [ ] Customized reader color scheme

- [ ] More Sources (OneDrive, etc.)

## 🚧 Known Issues

If there is a solution, PR welcome!

### Cross-domain issues

All WebApps can not get around the problem, most webDAV services can not be used

Personally, I solved the problem by using [`alist`](https://github.com/alist-org/alist) to build a private service

### Unable to turn page

There is a small chance that the page will not turn after the following operation, `epub.js`' problem

- Frequent window zooming

- Very frequent page turns (have done throttling, basically no problem)

### Jump page deviation

Jump to the specified page will have `+/-1` page deviation, `epub.js`'s `cfi` implementation problem

### Rendering deviation

Only on Android phones, the page will be shifted `1~2px` after each page turn, the reason is unknown (I guess it's also the problem of `epub.js`)

## License

[MIT](./LICENSE)
