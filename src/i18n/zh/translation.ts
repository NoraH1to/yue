import { UniformType } from '@/helper';
import { ITag } from '@/modules/book/Tag';
import { ISorter, TFsBook, TFsItemDir, TFsItemFile } from '@/modules/fs/Fs';
import { TAppSetting } from '@/modules/setting';

const sorter: Record<ISorter<object>['sort'], string> = {
  asc: '升序',
  desc: '降序',
};

const bookInfo: UniformType<TFsBook, string> = {
  addTs: '添加时间',
  author: '作者',
  title: '书名',
  lastProcess: {
    ts: '最近阅读',
  },
};

const tagInfo: { [key in keyof ITag]?: string } = {
  title: '标签',
  color: '颜色',
};

const dirItemInfo: UniformType<TFsItemDir | TFsItemFile, string> = {
  basename: '名称',
  lastmodTs: '最后修改日期',
};

const darkMode: Record<TAppSetting['colorMode'], string> = {
  dark: '暗黑',
  light: '明亮',
  system: '系统',
};

export default {
  'import ebook': '导入',
  'all book': '全部电子书',
  all: '全部',
  folder: '文件夹',
  'ebook already exist': '该电子书已经存在',
  'unsupported format': '文件格式不支持',
  tag: '标签',
  setting: '设置',
  'are you sure?': '你确定吗？',
  'search tag': '搜索标签',
  'root dir': '根目录',
  alreadySelectedCount: '选中了 {{count}} 项',
  'unknown author': '佚名',
  'last read': '上次阅读',
  'current location': '当前位置',
  'need webdav': '需要配置 webDAV',
  'goto setting': '前往设置',
  unsetting: '未设置',
  connected: '已连接',
  'webDAV Configuration': 'webDAV 配置',
  'webDAV error msg': 'webDAV 错误，请确保你的网络环境和服务状态',
  'nothing here': '空空如也',
  'no tag': '无标签',
  diffDate: {
    'any days ago': '{{days}} 天前',
    'any hours ago': '{{hours}} 小时前',
    'any minutes ago': '{{minutes}} 分钟前',
    'just now': '刚刚',
  },
  webDAVInfo: {
    url: '地址',
    username: '用户名',
    password: '密码',
  },
  'dark mode': '深色模式',
  darkMode,
  sorter,
  bookInfo,
  tagInfo,
  dirItemInfo,
  formHelper: {
    required: '必填',
    'already exist tag': '该标签已存在',
    'incorrect color value': '色值不合法',
    'incorrect url': 'URL 不合法',
  },
  action: {
    confirm: '确认',
    cancel: '取消',
    edit: '编辑',
    save: '保存',
    delete: '删除',
    create: '新建',
    'create tag': '新建标签',
    'edit tag': '编辑标签',
    'multi select': '多选',
    close: '关闭',
    'select all': '全选',
    'bulk edit book tag': '批量编辑书籍标签',
    'start reading': '开始阅读',
    'continue reading': '继续阅读',
  },
  actionRes: {
    'import book success': '成功导入书籍',
    'import book fail': '导入书籍失败',
    'create tag fail': '新建标签失败',
    'edit tag fail': '编辑标签失败',
    'delete tag success': '成功删除标签',
    'delete book success': '成功删除书籍',
  },
  bookEditTag: {
    'no tag by search': '无结果',
  },
  dirItemMenu: {
    'download to local': '下载到本地',
    'delete local': '删除本地文件',
  },
};
