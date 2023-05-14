import { md5FromBlob } from '@/helper';
import { IToc } from '@/modules/book/Toc';
import Epub, { NavItem } from 'epubjs';
import { Parser } from '..';
import { EpubBook, TEpubBookInfo } from './book';

export const epubToc2CommonToc = (toc: NavItem[]): IToc[] => {
  return toc.map((t) => ({
    title: t.label,
    href: t.href,
    children: t.subitems ? epubToc2CommonToc(t.subitems) : undefined,
  }));
};

const parser: Parser<typeof EpubBook>['parse'] = async (
  target: File,
  cacheInfo = {},
) => {
  const epub = Epub(await target.arrayBuffer());
  const meta = await epub.loaded.metadata;
  const manualCover = epub.packaging.manifest['cover.jpg'];
  const coverUrl =
    (await epub.coverUrl()) ||
    (manualCover &&
      (await epub.resources.createUrl(
        `${epub.path.resolve(manualCover.href)}`,
      )));
  // epub.js 中 `navigation.toc` 的目录数据有些问题，部分多余的东西没过滤，导致经常跳转不了
  const toc: IToc[] =
    cacheInfo.toc ||
    epubToc2CommonToc((await epub.loaded.navigation).toc).map((t) => {
      if (t.href.startsWith('/')) t.href = t.href.replace('/', '');
      else if (t.href.startsWith('../')) t.href = t.href.replace('../', '');
      t.href = t.href.replace(/(?!^)#.*/, '');
      return { ...t };
    });

  const info: TEpubBookInfo = {
    epub,
    target: cacheInfo.target || target,
    cover:
      cacheInfo.cover ||
      (coverUrl ? await (await fetch(coverUrl)).blob() : undefined),
    title: cacheInfo.title || meta.title,
    author: cacheInfo.author || meta.creator,
    description: cacheInfo.description || meta.description,
    publisher: cacheInfo.publisher || meta.publisher,
    toc,
    cfiList: cacheInfo.cfiList || (await epub.locations.generate(150)),
    hash: cacheInfo.hash || (await md5FromBlob(cacheInfo.target || target)),
    lastProcess: cacheInfo.lastProcess || { ts: 0, percent: 0 },
  };
  return new EpubBook(info);
};

export default parser;
