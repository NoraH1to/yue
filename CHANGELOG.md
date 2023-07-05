# Changelog
### [1.6.1](///compare/v1.6.0...v1.6.1) (2023-07-05)

## [1.6.0](///compare/v1.5.0...v1.6.0) (2023-07-04)


### Features

* **comic:** support comic [#3](undefined/undefined/undefined/issues/3) cbf5574


### Bug Fixes

* **parser-comic:** wasm import problem 29afae1
* **pwa:** wasm files are not cached correctly 7c7eb48

## [1.5.0](///compare/v1.4.0...v1.5.0) (2023-06-11)


### Features

* **webdav:** support sync reading process 7a00c3a
* **webdav:** webdav is now associated with a unique hash of the book 3bce6ae


### Bug Fixes

* **indexed-db:** fix database update logic b0a3992
* **indexed-db:** update the association table of book and tag 7fabfcb
* **parser-pdf:** parser error when has not toc 428d5f5

## [1.4.0](///compare/v1.3.0...v1.4.0) (2023-05-29)


### Features

* **book-list:** support remember sorting settings 0a557fa
* **vercel:** support reverse proxy [#2](undefined/undefined/undefined/issues/2) 3f1e878
* **webdav:** support custom dir base path [#2](undefined/undefined/undefined/issues/2) 148ce24


### Bug Fixes

* **book-list:** sorting does not reset with page switch 3b7ab43
* **i18n:** incorrect i18n import and memo deps 57b64cc
* **reader:** forget to destroy the book causes the drag fail 9821a25
* **reader:** no autofocus causes invalid hotkeys b3e4e65
* **webdav:** when the webdav service mime type is incorrect, it does not resolve correctly 6613c6c

## [1.3.0](///compare/v1.2.0...v1.3.0) (2023-05-23)


### Features

* **about:** add about page c0c8738
* **i18n:** support manual language switching 03d1680
* **pwa:** complete pwa support 997b0b5
* **reader:** add top toolbar 993e1c9
* **reader:** support hotkey operation d2a93ae
* **recent-reads:** add toolbar b54ad6a


### Bug Fixes

* **parser-epub:** ensure that the night mode style is correct 38b1c96
* **pwa-updater:** fix i18n 991567a
* **reader:** scroll lock issue 6df2f93

## [1.2.0](///compare/v1.1.0...v1.2.0) (2023-05-17)


### Features

* **pdf:** support pdf 2c129df


### Bug Fixes

* **parser-epub:** font settings have no effect dd2fbfa
* **reader:** fix the problem of locking the layout causing the inability to scroll fc26ad9
* **recent-reads:** fix layout bugs bbfbf79
* **type:** fix reader params type error 118b822

## [1.1.0](///compare/v0.0.0...v1.1.0) (2023-05-16)


### Features

* **recent-reads:** add recent reading page 7c43622


### Bug Fixes

* **parser-epub:** 尽量让文件本身有问题的图书显示正确的目录 1ad0f3e
* **parser-epub:** 修正拍平嵌套目录的实现 d7f6ef5

## 0.0.0 (2023-05-15)


### Features

* **parser-epub:** epub 在亮色模式时使用书本内置的文本颜色 f2e1f71
* **reader:** 支持调整字体大小等设置 0ca4d8a


### Bug Fixes

* **reader:** 修正打开书本后返回卡加载的问题 bfe9c79
* **reader:** 修正移动端 safari 添加到主屏幕后的滚动溢出 ac4f803
* **tip-page:** 修正 safari 上超链接样式问题 0fd6130
