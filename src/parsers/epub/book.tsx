import { Promiser, flatArrayWithKey, throttle } from '@/helper';
import {
  ABook,
  ReaderCompProps,
  TBookConstructorInfo,
} from '@/modules/book/Book';
import { IToc } from '@/modules/book/Toc';
import { Contents, Book as EpubInstance, Spine as __Spine } from 'epubjs';
import { RenditionOptions } from 'epubjs/types/rendition';
import _Spine from 'epubjs/types/spine';
import { FC, useEffect } from 'react';
type Spine = _Spine & __Spine;

export type TEpubBookInfo = TBookConstructorInfo<string> & {
  cfiList: string[];
  epub: EpubInstance;
};

/**
 * // TODO: 频繁缩放窗口、翻页会导致无法翻页
 */
export class EpubBook extends ABook<string> {
  epub: EpubInstance;
  cfiList: string[] = [];
  type = 'epub';
  totalPages = 500;
  /**
   * 记录是否打开过页面，防止用户开关过快触发 epub.js 的
   * bug（在加载后立刻获取当前进度永远是第一页）
   */
  hasChangePage = false;
  promiser = new Promiser<void>();
  ready = this.promiser.promise;
  rendered = false;

  hrefMap: Record<string, IToc> = {};
  flatToc: IToc[];
  isPageChanging = false;

  constructor(target: TEpubBookInfo) {
    super(target);
    this.epub = target.epub;
    this.cfiList = target.cfiList;
    target.cfiList &&
      target.cfiList.length &&
      this.epub.locations.load(target.cfiList as unknown as string);
    this.totalPages = target.cfiList.length || this.totalPages;
    this.flatToc = flatArrayWithKey(target.toc, 'children');
  }

  async render(container: Element | string) {
    try {
      const options: RenditionOptions = {
        width: '100%',
        height: '100%',
        flow: 'paginated',
        manager: 'continuous',
        snap: false,
        minSpreadWidth: 9999, // make sure in single page
        allowScriptedContent: true,
      };
      let re;
      // 这里 if else 是为了 ts 的报错，非常逆天
      if (typeof container === 'string')
        re = this.epub.renderTo(container, options);
      else if (container instanceof Element)
        re = this.epub.renderTo(container, options);
      else throw new Error('Invalid render container');
      /**
       * 生成 href 获得标题的哈希表，loc 中的 href 不一定会在目录中
       * 例如有 1，2，3，4 四页，但是只有 1，4 在目录中
       * 当翻到第 2 页时，正常获取拿不到当前章节信息，所以这里将 2，3 页也指向
       * 第 1 页的章节信息
       */
      this.flatToc.forEach((item) => {
        this.hrefMap[item.href] = item;
      });
      const spine = this.epub.spine as Spine;
      let tocIndex = 0;
      let prevTocIndex = 0;
      const maxTocIndex = this.flatToc.length - 1;
      spine.items.forEach((sp) => {
        if (sp.href === this.flatToc[tocIndex].href) {
          prevTocIndex = tocIndex;
          if (tocIndex < maxTocIndex) {
            tocIndex++;
          }
        } else if (!this.hrefMap[sp.href]) {
          this.hrefMap[sp.href] = this.flatToc[prevTocIndex];
        }
      });
      // 加载完毕
      this.promiser.resolve();
      this.rendered = true;
    } catch (e) {
      this.promiser.reject(e);
    }
  }

  ReaderComponent: FC<ReaderCompProps> = ({
    readerTheme,
    readerSetting,
    colorMode,
  }) => {
    useEffect(() => {
      this.render('epub-reader-content');
    }, []);
    useEffect(() => {
      (async () => {
        await this.ready;
        /**
         * epubjs 没有处理旧主题，样式无法完全覆盖上次的
         * 每次应用主题前先清理旧主题，方法较为 hack
         * 参考 https://github.com/futurepress/epub.js/blob/0963efe979e34d53507fee1dc10827ecb07fdc75/src/contents.js#L728
         */
        const contents = this.epub.rendition.getContents();
        for (const content of contents as unknown as Contents[]) {
          // @ts-ignore
          const sheetDom = content?._getStylesheetNode(
            'default',
          ) as HTMLStyleElement;
          if (!sheetDom) break;
          sheetDom.remove();
        }
        // 应用主题
        function makeCssRuleImportant(cssStr?: string) {
          return cssStr ? `${cssStr} !important` : cssStr;
        }
        const color =
          !readerTheme.color || colorMode === 'light'
            ? undefined
            : `${readerTheme.color}`;
        const background = readerTheme.backgroundColor
          ? `${readerTheme.backgroundColor}`
          : undefined;
        this.epub.rendition.themes.default({
          body: {
            background: makeCssRuleImportant(background),
          },
          'body, span': {
            'font-size': `${readerSetting.fontSize}px !important`,
          },
          '*': {
            color,
          },
          'p, div, span': {
            'letter-spacing': `${readerSetting.letterGap}em !important`,
            'line-height': `${readerSetting.lineHeight} !important`,
            'margin-top': `${readerSetting.paragraphGap}px !important`,
            'margin-bottom': `${readerSetting.paragraphGap}px !important`,
            color: makeCssRuleImportant(color),
            background: makeCssRuleImportant(background),
          },
        });
      })();
    }, [readerTheme, readerSetting, colorMode]);
    return (
      <div id="epub-reader-content" style={{ height: '100%', width: '100%' }} />
    );
  };

  getPages() {
    return this.totalPages;
  }

  getCurrentSectionCurrentPage() {
    const loc = this.getLoc();
    if (!loc) return 0;
    return loc.start.displayed.page;
  }

  getCurrentSectionPages() {
    const loc = this.getLoc();
    if (!loc) return 0;
    return loc.start.displayed.total;
  }

  changePageIfEnable<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return ((...args: Parameters<T>) => {
      if (this.isPageChanging) return;
      this.isPageChanging = true;
      try {
        return fn(...args);
      } finally {
        this.isPageChanging = false;
      }
    }) as T;
  }

  nextPage = throttle(
    this.changePageIfEnable(async () => {
      await this.epub.rendition.next();
      await this.ensureLoc();
      this.hasChangePage = true;
    }),
    100,
  );

  prevPage = throttle(
    this.changePageIfEnable(async () => {
      await this.epub.rendition.prev();
      await this.ensureLoc();
      this.hasChangePage = true;
    }),
    100,
  );

  /**
   * loc 的初始化和翻页都会有短暂的时间拿不到 loc
   * loc 更新突出一个随缘
   */
  async ensureLoc() {
    let timeout = false;
    setTimeout(() => (timeout = true), 2000);
    const checked = new Promiser<void>();
    const checkLoc = () => {
      return this.epub.rendition?.location || timeout
        ? checked.resolve()
        : window.requestAnimationFrame(checkLoc);
    };
    window.requestAnimationFrame(checkLoc);
    await checked.promise;
  }

  jumpTo = this.changePageIfEnable(async (page: string | number) => {
    try {
      const target =
        typeof page === 'number'
          ? page === 0
            ? undefined
            : this.epub.locations.cfiFromPercentage(page / this.totalPages)
          : page;
      await this.epub.rendition.display(target);
      await this.epub.rendition.display(target);
      await this.ensureLoc();
      this.hasChangePage = true;
    } catch (e) {
      console.error(e);
    }
  });

  async destroy() {
    this.epub.destroy();
  }

  getLoc() {
    const loc = this.epub.rendition?.currentLocation?.();
    return loc.start ? loc : this.epub.rendition.location || null;
  }

  async getCurrentProcess() {
    if (!this.hasChangePage) return this.lastProcess;
    await this.ensureLoc();
    const loc = this.getLoc();
    if (!loc) return null;
    try {
      const res = {
        value: loc.start.cfi,
        ts: Date.now(),
        percent: this.epub.locations.percentageFromCfi(loc.start.cfi),
        // loc 中的 href 只有路径没有参数，toc 中可以带参数
        navInfo: Object.entries(this.hrefMap).find(([key]) =>
          key.startsWith(loc.start.href),
        )?.[1],
      };
      return res;
    } catch (e) {
      return null;
    }
  }
}
