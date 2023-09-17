import { GetPath } from '@/helper';
import { IBookInfo } from '@/modules/book/Book';
import { ITag } from '@/modules/book/Tag';
import { WebDAVClient } from 'webdav';

export type TFsBase = { addTs: number } & Pick<
  TFsItemFile | TFsItemDir,
  'lastmodTs'
>;

export type TFsBook = IBookInfo & TFsBase;
export type TFsBookWithoutContent = Omit<TFsBook, 'target' | 'archive'>;

export type TFsBookWithTags = TFsBook & {
  tags: string[];
  tagsMap: Record<string, boolean>;
};
export type TFsBookWithoutContentWithTags = Omit<
  TFsBookWithTags,
  'target' | 'archive'
>;

export interface TFsItemFile {
  id: string;
  type: 'file';
  filename: string;
  basename: string;
  lastmodTs: number;
  size: number;
  mime: string;
}

export interface TFsItemDir {
  id: string;
  type: 'directory';
  filename: string;
  basename: string;
  lastmodTs: number;
}

export type TFsDir = {
  filename: string;
  items: (TFsItemFile | TFsItemDir)[];
};

export type TFsTag = ITag &
  TFsBase & {
    prev: 'none' | string;
    next: 'none' | string;
  };

export type TTagDistribution = TFsTag & {
  distribution: 'none' | 'all' | 'partial';
};

export interface ISorter<T extends object = object, K = keyof T> {
  sort: 'asc' | 'desc';
  key: K;
}

export type TBookSorter = ISorter<
  Record<GetPath<Omit<TFsBook, 'target'>>, unknown>
>;

export type TDirItemSorter = ISorter<
  Record<GetPath<Omit<TFsItemDir | TFsItemFile, 'type'>>, unknown>
>;

export type TSourceItemInfo = { sourceId: string; etag: string };

export interface IFs {
  /**
   * 添加一本图书
   * @param book 图书信息
   * @param sourceInfo 关联的源信息
   */
  addBook(
    book: Omit<TFsBook, 'addTs' | 'lastmodTs'>,
    sourceInfo?: TSourceItemInfo,
  ): Promise<TFsBookWithoutContent>;
  /**
   * 获得全部图书
   */
  getBooks(): Promise<TFsBookWithTags[]>;
  getBooksWithoutContent(): Promise<TFsBookWithoutContentWithTags[]>;
  /**
   * 获得最近阅读的图书
   * @param limit 最大数量
   */
  getRecentReadsBooks(limit: number): Promise<TFsBookWithTags[]>;
  getRecentReadsBooksWithoutContent(
    limit: number,
  ): Promise<TFsBookWithoutContentWithTags[]>;
  /**
   * 根据哈希值获得一本图书信息
   * @param hash 图书哈希值
   */
  getBookByHash(hash: string): Promise<TFsBook | undefined>;
  getBookByHashWithoutContent(
    hash: string,
  ): Promise<TFsBookWithoutContent | undefined>;
  /**
   * 查找本地是否有指定的源中书籍
   * @param sourceInfo 源中的书本信息
   */
  getBookBySourceItemInfo(
    sourceInfo: TSourceItemInfo,
  ): Promise<TFsBook | undefined>;
  getBookBySourceItemInfoWithoutContent(
    sourceInfo: TSourceItemInfo,
  ): Promise<TFsBookWithoutContent | undefined>;
  /**
   * 获得某标签的所有图书
   * @param tagID 标签唯一键
   */
  getBooksByTag(tagID: string): Promise<TFsBookWithTags[]>;
  getBooksByTagWithoutContent(
    tagID: string,
  ): Promise<TFsBookWithoutContentWithTags[]>;
  /**
   * 更新一本图书的信息
   * @param info.hash 图书哈希值
   * @param info.info 需要更新的内容
   */
  updateBook(info: {
    hash: string;
    info: Partial<Omit<TFsBook, 'hash'>>;
  }): Promise<void>;
  /**
   * 给图书打标签
   * @param info.hash 图书哈希值
   * @param info.tagID 标签唯一键
   */
  addBookTag(info: { hash: string; tagID: string }): Promise<boolean>;
  /**
   * 去除图书标签
   * @param info.hash 图书哈希值
   * @param info.tagID 标签唯一键
   */
  deleteBookTag(info: { hash: string; tagID: string }): Promise<boolean>;
  /**
   * 删除图书
   * @param hash 图书哈希值，可以是列表
   */
  deleteBook(hash: string | string[]): Promise<void>;

  /**
   * 根据路径获得一个文件夹信息
   * @param client webDAV 客户端
   * @param filename 文件夹路径名
   * @param options.sorter 排序规则
   */
  getDir(
    client: WebDAVClient,
    filename: string,
    options: { sorter: TDirItemSorter },
  ): Promise<TFsDir | undefined>;

  /**
   * 添加标签
   * @param info
   */
  addTag(info: ITag): Promise<TFsTag>;
  /**
   * 获得全部标签
   */
  getTags(): Promise<TFsTag[]>;
  /**
   * 根据标题获得标签
   * @param title 标签标题
   */
  getTagByTitle(title: string): Promise<TFsTag | undefined>;
  /**
   * 根据标签唯一键获得标签
   * @param tagID
   */
  getTagById(tagID: string): Promise<TFsTag | undefined>;
  /**
   * 获得某本图书的所有标签
   * @param hash 图书唯一键
   */
  getTagsByBookHash(hash: string): Promise<TFsTag[]>;
  /**
   * 更新指定标签信息
   * @param info.id 标签唯一键
   * @param info.info 标签信息
   */
  updateTag(info: {
    id: string;
    info: Partial<Omit<TFsTag, 'id'>>;
  }): Promise<TFsTag>;
  /**
   * 删除标签
   * @param id 标签唯一键，可以是列表
   */
  deleteTag(id: string | string[]): Promise<void>;
  /**
   * 将 source 标签移动到 target 的位置
   */
  moveTag(
    sourceID: string,
    targetID: string,
    sort: TBookSorter['sort'],
  ): Promise<void>;
  /**
   * 获得图书的哈希分布
   * @param bookHashList 书籍哈希列表
   */
  getTagDistributionByBookHashList(
    bookHashList: string[],
  ): Promise<TTagDistribution[]>;
}
