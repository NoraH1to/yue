import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { ResponseDataDetailed } from 'webdav';
import anysort from 'anysort-typed';
import { fileOpen } from 'browser-fs-access';
import mime from 'mime';
import { BaseSyntheticEvent, ReactEventHandler } from 'react';
import Md5 from 'spark-md5';
import i18n from './i18n';
import { ABook } from './modules/book/Book';
import fs from './modules/fs';
import {
  TBookSorter,
  TDirItemSorter,
  TFsBookWithoutContent,
  TFsDir,
  TSourceItemInfo,
} from './modules/fs/Fs';
import { getParser } from './parsers';

export const Mime = mime;

export function hasOwn(target: object, key: string[] | string): boolean {
  key = Array.isArray(key) ? key : [key];
  return key.every((k) => Object.hasOwn(target, k));
}

/**
 * shallow del falsy prop like `null`,`undefined`,`''`,`0`(default not include)
 * @param options default `{ includeEmptyString: true, includeZeroNumber: false }`
 * @returns
 */
export function delFalsy<T extends Record<string, any>>(
  target: T,
  options?: { includeEmptyString?: boolean; includeZeroNumber?: boolean },
): T {
  const { includeEmptyString = true, includeZeroNumber = false } =
    options || {};
  const o = { ...target };
  Object.keys(o).forEach((k) => {
    if (
      o[k] === null ||
      o[k] === undefined ||
      o[k] === false ||
      (includeEmptyString && o[k] === '') ||
      (includeZeroNumber && o[k] === 0)
    )
      delete o[k];
  });
  return o;
}

export async function md5FromBlob(blob: Blob): Promise<string> {
  let resolve: (value: string) => void;
  let reject: (reason: ProgressEvent<FileReader>) => void;
  const pm = new Promise<string>((rs, rj) => ([resolve, reject] = [rs, rj]));

  const reader = new FileReader();
  const chunkSize = 2097152; // 2MB buffer chunk
  const chunks = Math.ceil(blob.size / chunkSize);
  let curChunk = 0;
  const md5 = new Md5.ArrayBuffer();

  const loadNext = () => {
    const start = curChunk * chunkSize;
    const end = start + chunkSize >= blob.size ? blob.size : start + chunkSize;
    reader.readAsArrayBuffer(blob.slice.call(blob, start, end));
  };

  reader.onload = (e) => {
    md5.append(e.target!.result! as ArrayBuffer);
    curChunk++;

    if (curChunk < chunks) {
      loadNext();
    } else {
      resolve(md5.end());
    }
  };

  reader.onerror = (e) => reject(e);

  loadNext();

  return pm;
}

export const getExtByFilename = (filename: string) => {
  const res = filename.split('.');
  if (res.length < 2) return null;
  return res[res.length - 1];
};

export const getExtByMime = (mime: string) => {
  return Mime.getExtension(mime);
};

export const getMimeByExt = (ext: string) => {
  return Mime.getType(ext);
};

export const getBasenameByFilename = (filename: string) => {
  const res = filename.split('.');
  res.pop();
  return res.join('.');
};

export const importBook = async (
  target?: File | Promise<File>,
  cacheInfo?: Partial<ABook>,
  sourceInfo?: TSourceItemInfo,
) => {
  target =
    target instanceof Promise
      ? await target
      : target || (await fileOpen({ multiple: false }));
  if (!target) return;
  const hash = await md5FromBlob(target);
  const originBook = await fs.getBookByHashWithoutContent(hash);
  if (originBook && !sourceInfo) {
    return {
      res: 'exist',
      msg: i18n.t('ebook already exist'),
      info: originBook,
    } as const;
  }
  const type = getExtByMime(target.type) || getExtByFilename(target.name);
  if (!type) return { res: false, msg: i18n.t('unsupported format') } as const;

  const parser = getParser(type);
  if (!parser)
    return {
      res: false,
      msg: `${i18n.t('unsupported format')} "${type}"`,
    } as const;

  const book = await new parser.Book(await parser.parse(target, cacheInfo));

  const info = await fs.addBook(
    {
      ...parser.getCacheableInfo(book),
      type: book.type,
    },
    sourceInfo,
  );

  return {
    res: 'success',
    info,
  } as const;
};

export const getRandomColor = <T = 'hex' | 'rgb'>(type = 'hex') => {
  const rgb = [
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255,
  ] as const;
  if (type === 'rgb') return rgb;
  else
    return `#${rgb
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')}`;
};

/**
 * 由 ChatGPT 编写，检测字符串是否为合法的色值
 * @param color
 */
export const isValidColor = (color?: string) => {
  // 如果输入的颜色值为空或者不是字符串类型，则返回 false
  if (!color || typeof color !== 'string') {
    return false;
  }

  // 去除输入字符串中的空格
  color = color.trim();

  // 如果颜色值是 RGB 格式（例如：rgb(255, 255, 255)）
  if (/^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/.test(color)) {
    // 将 RGB 值提取出来，并转换为整数
    const [r, g, b] = color.match(/\d{1,3}/g)!.map((x) => parseInt(x, 10));
    // 检查 RGB 值是否在合法范围内（0~255）
    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
  }

  // 如果颜色值是十六进制格式（例如：#ffffff）
  if (/^#([0-9a-fA-F]{3}){1,2}$/.test(color)) {
    // 去除 # 号，并将颜色值转换为整数
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    // 检查十六进制值是否在合法范围内（0~0xffffff）
    return num >= 0 && num <= 0xffffff;
  }

  // 如果颜色值既不是 RGB 格式也不是十六进制格式，则返回 false
  return false;
};

/**
 * 由 ChatGPT 编写，移动数组内的项目到指定下标
 *
 * e.g. `fromIndex = 0, toIndex = 3`，目标移动后下标为 `3`
 * @param arr 目标数组
 * @param fromIndex 需要移动项所在下标
 * @param toIndex 移动目的下标
 */
export const moveArrayItem = <T extends unknown[]>(
  arr: T,
  fromIndex: number,
  toIndex: number,
) => {
  // 如果数组为空或者下标越界，则直接返回原数组
  if (
    !Array.isArray(arr) ||
    fromIndex < 0 ||
    fromIndex >= arr.length ||
    toIndex < 0 ||
    toIndex >= arr.length
  ) {
    return arr;
  }
  // 取出需要移动的元素，并将其从原数组中删除
  const item = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, item);

  // 返回移动后的数组
  return arr;
};

/**
 * 由 ChatGPT 编写，判断子元素是否在某元素中
 * @param parent 父元素
 * @param child 子元素
 */
export const isDescendant = (
  parent: HTMLElement,
  child: HTMLElement | null,
) => {
  let node = child?.parentNode;

  while (node) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
};

export const mergeEventListener = <E>(
  ...listeners: Array<ReactEventHandler<E> | undefined | false | null>
): ReactEventHandler<E> => {
  return (...args) => {
    for (const listener of listeners) {
      listener && listener(...args);
    }
  };
};

export const shallowEqual = <T extends Record<any, any>>(obj1: T, obj2: T) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!Object.hasOwn(obj2, key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
};

export const sortDirItemsBySorter = (
  items: TFsDir['items'],
  sorter: TDirItemSorter,
) =>
  // @ts-ignore
  anysort(items, [
    'type-is(directory)',
    `${sorter.key}${sorter.sort === 'desc' ? '-reverse()' : ''}`,
  ]);

export const sortBooksBySorter = <T extends TFsBookWithoutContent>(
  books: T[],
  sorter: TBookSorter,
) =>
  // @ts-ignore
  anysort(books, [
    `${sorter.key}${sorter.sort === 'desc' ? '-reverse()' : ''}`,
  ]) as T[];

export const diffDates = (
  date1: Date,
  date2: Date,
): { days: number; hours: number; minutes: number; seconds: number } => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
};

export class Promiser<T> {
  promise: Promise<T>;
  resolve!: (value: T) => unknown;
  reject!: (reason: any) => unknown;
  status: 'pending' | 'resolved' | 'rejected' = 'pending';
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = (v) => {
        this.status = 'resolved';
        resolve(v);
      };
      this.reject = (r) => {
        this.status = 'rejected';
        reject(r);
      };
    });
  }
}

export const getEventNameAndCapture = (str: string) => {
  const match = str.match(/on([a-zA-Z]+)(Capture)?/);

  if (match) {
    const value = match[1].toLowerCase();
    const hasCapture = !!match[2];
    return { value, hasCapture };
  }

  return { value: '', hasCapture: false };
};

export const throttle = <F extends (...args: any[]) => any, R = ReturnType<F>>(
  func: F,
  delay: number,
): ((...args: Parameters<F>) => R extends Promise<any> ? R : Promise<R>) => {
  let timeoutId: NodeJS.Timeout;
  let lastExecutedTime = 0;
  const promiser = new Promiser<R>();

  // @ts-ignore
  return async function (...args) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastExecutedTime;
    if (elapsedTime >= delay) {
      lastExecutedTime = currentTime;
      try {
        promiser.resolve((await func(...args)) as R);
      } catch (e) {
        promiser.reject(e);
      }
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          promiser.resolve((await func(...args)) as R);
        } catch (e) {
          promiser.reject(e);
        }
        lastExecutedTime = Date.now();
      }, delay - elapsedTime);
    }
    return promiser.promise;
  };
};

export const formatTime = (
  template: string,
  date: Date = new Date(),
): string => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  const formattedTime = template
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);

  return formattedTime;
};

export const preventDefault =
  (prevent = true, stop = true) =>
  (e: BaseSyntheticEvent) => {
    if (e.cancelable) {
      prevent && e.preventDefault();
      stop && e.stopPropagation();
    }
  };

export const flatArrayWithKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
): T[] => {
  return array.reduce<T[]>((result, item) => {
    if (Array.isArray(item[key]) && item[key].length) {
      return result.concat(item).concat(flatArrayWithKey(item[key], key));
    }
    return result.concat(item);
  }, []);
};

export const cancelAble = <T>(p: Promise<T>) => {
  const promiser = new Promiser<T | 'cancel'>();
  const cancel = () => {
    promiser.resolve('cancel');
  };
  p.then(promiser.resolve);
  p.catch(promiser.reject);
  return [promiser.promise, cancel] as const;
};

function getPrecision(number: number) {
  const numString = String(number);
  const decimalIndex = numString.indexOf('.');

  // 如果没有小数点，则返回 0
  if (decimalIndex === -1) {
    return 0;
  }

  // 计算小数位数精度
  return numString.length - decimalIndex - 1;
}

export const multiply = (a: number, b: number) => {
  const precision = getPrecision(a) + getPrecision(b);
  const factor = Math.pow(10, precision);
  return (a * factor * (b * factor)) / (factor * factor);
};

export const add = (a: number, b: number) => {
  const precision = Math.max(getPrecision(a), getPrecision(b));
  const factor = Math.pow(10, precision);
  return (multiply(a, factor) + multiply(b, factor)) / factor;
};

export const subtract = (a: number, b: number) => {
  const precision = Math.max(getPrecision(a), getPrecision(b));
  const factor = Math.pow(10, precision);
  return (multiply(a, factor) - multiply(b, factor)) / factor;
};

export const emptyFn = () => {
  /* empty */
};

export const emptyAsyncFn = async () => {
  /* empty */
};

export const mergeSxProps = (...args: (SxProps<Theme> | undefined | null)[]) =>
  args.reduce<SxProps<Theme>[]>((pre, cur) => {
    if (!cur) return pre;
    if (Array.isArray(cur)) {
      return pre.concat(cur);
    } else {
      pre.push(cur);
      return pre;
    }
  }, []) as SxProps<Theme>;

export const isWebDAVDetail = <T>(
  res: T | ResponseDataDetailed<T>,
): res is ResponseDataDetailed<T> => {
  return (
    // @ts-ignore
    typeof res?.status === 'number' && // @ts-ignore
    typeof res?.statusText === 'string' && // @ts-ignore
    res?.headers
  );
};

export const isImageFileName = (fileName: string) => {
  const imageExtensions = /\.(jpg|jpeg|png)$/i;
  return imageExtensions.test(fileName);
};

export type GetPath<
  T extends object,
  K extends keyof T = keyof T,
> = K extends string
  ? T[K] extends object
    ? `${K}` | `${K}.${GetPath<T[K]>}`
    : `${K}`
  : '';

export type UniformType<
  O extends object,
  T = string,
  R extends boolean = false,
> = R extends true
  ? {
      [K in keyof O]: O[K] extends object ? UniformType<O[K], T, true> : string;
    }
  : {
      [K in keyof O]?: O[K] extends object
        ? UniformType<O[K], T, false>
        : string;
    };

export type PromiseValue<T> = T extends Promise<infer R> ? R : never;

export type Type2Interface<T> = Pick<T, keyof T>;
