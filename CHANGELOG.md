# Changelog
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
