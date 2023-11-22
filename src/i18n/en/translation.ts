import { UniformType } from '@/helper';
import { ITag } from '@/modules/book/Tag';
import { ISorter, TFsBook, TFsItemDir, TFsItemFile } from '@/modules/fs/Fs';
import { TAppSetting, TReaderSetting } from '@/modules/setting';

const sorter: Record<ISorter<object>['sort'], string> = {
  asc: 'asc',
  desc: 'desc',
};

const bookInfo: UniformType<TFsBook, string> = {
  addTs: 'time added',
  author: 'author',
  title: 'title',
  lastProcess: {
    ts: 'recently Read',
  },
};

const tagInfo: { [key in keyof ITag]?: string } = {
  title: 'tag',
  color: 'color',
};

const dirItemInfo: UniformType<TFsItemDir | TFsItemFile, string> = {
  basename: 'name',
  lastmodTs: 'last modified time',
};

const darkMode: Record<TAppSetting['colorMode'], string> = {
  dark: 'dark',
  light: 'light',
  system: 'system',
};

const readerSetting: UniformType<TReaderSetting> = {
  fontSize: 'font size',
  letterGap: 'letter spacing',
  lineHeight: 'line height',
  paragraphGap: 'paragraph spacing',
};

export default {
  'unknown': 'unknown',
  'import ebook': 'import',
  'all book': 'all book',
  all: 'all',
  folder: 'folder',
  'ebook already exist': 'ebook already exist',
  'unsupported format': 'file format not supported',
  tag: 'tag',
  setting: 'setting',
  'are you sure?': 'are you sure?',
  'search tag': 'search tag',
  'root dir': 'root',
  alreadySelectedCount: 'selected {{count}} items',
  'last read': 'last read',
  'current location': 'current location',
  'need webdav': 'need webDAV',
  'goto setting': 'goto setting',
  unsetting: 'not set',
  connected: 'connected',
  'webDAV Configuration': 'webDAV Configuration',
  'webDAV error msg':
    'webDAV error, please ensure your network environment and service status',
  'nothing here': 'nothing here',
  'empty toc': 'TOC is empty',
  'page not found': 'page not found',
  'go back': 'return to previous page',
  'go home': 'go to homepage',
  'unexist book': "books don't exist.",
  'no tag': 'no tag',
  'recent reads': 'recent reads',
  'app can update': 'App update available, click on refresh button to update.',
  other: 'other',
  about: 'about',
  repository: 'repository',
  'remember setting': 'remember',
  'sync book process': 'auto-sync reading progress',
  on: 'on',
  off: 'off',
  'source sync dir': 'path to synchronized data',
  'find new process': 'cloud progress is newer',
  'update process or not':
    'whether to sync to local or not, if not, local progress will be used to overwrite the cloud progress',
  'use cloud process': 'use cloud',
  'use local process': 'use local',
  diffDate: {
    'any days ago': '{{days}} days ago',
    'any hours ago': '{{hours}} hours ago',
    'any minutes ago': '{{minutes}} minutes ago',
    'just now': 'just now',
  },
  webDAVInfo: {
    url: 'url',
    customDirBasePath: 'custom dir base path',
    username: 'username',
    password: 'password',
  },
  'dark mode': 'dark mode',
  darkMode,
  readerSetting,
  sorter,
  bookInfo,
  tagInfo,
  dirItemInfo,
  'unknown author': 'unknown author',
  formHelper: {
    required: 'Required',
    'already exist tag': 'Tag already exists',
    'incorrect color value': 'Incorrect color value',
  },
  action: {
    refresh: 'refresh',
    confirm: 'confirm',
    cancel: 'cancel',
    edit: 'edit',
    save: 'save',
    delete: 'delete',
    create: 'create',
    'create tag': 'create tag',
    'edit tag': 'edit tag',
    'multi select': 'multi select',
    close: 'close',
    'select all': 'select all',
    'bulk edit book tag': 'batch editing book tags',
    'start reading': 'start reading',
    'continue reading': 'continue reading',
    'sync process': 'synchronize progress',
    check: 'check',
  },
  actionRes: {
    'import book success': 'import book successfully',
    'import book fail': 'failed to import book',
    'create tag fail': 'failed to create tag',
    'edit tag fail': 'failed to edit tag',
    'delete tag success': 'delete tag successful',
    'delete book success': 'delete book successful',
    'sync fail': 'sync failure',
    'sync success': 'sync success',
  },
  bookEditTag: {
    'no tag by search': 'no results',
  },
  dirItemMenu: {
    'download to local': 'download to local',
    'delete local': 'delete local files',
  },
};
