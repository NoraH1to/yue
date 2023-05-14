import { Overwrite, Required } from 'utility-types';
import {
  FileStat,
  ResponseDataDetailed,
  createClient as _createClient,
} from 'webdav';

export const createClient = (
  url: string,
  config: {
    username: string;
    password: string;
  },
) => {
  const { username, password } = config;
  return _createClient(url, { username, password });
};

type FileStatFile = Required<
  Overwrite<FileStat, { type: 'file'; etag: string }>,
  'mime' | 'size'
>;

type FileStatDirectory = Omit<
  Overwrite<FileStatFile, { type: 'directory'; etag: null }>,
  'mime'
>;

export const isFile = (target: FileStat): target is FileStatFile =>
  target.type === 'file';

export const isDirectory = (target: FileStat): target is FileStatDirectory =>
  target.type === 'directory';

export const isResponseDetail = (
  target: object,
): target is ResponseDataDetailed<Array<FileStat>> =>
  Object.hasOwn(target, 'status');
