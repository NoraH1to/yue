import { delFalsy, getBasenameByFilename } from '@/helper';
import { IToc } from '@/modules/book/Toc';
import { PDFPageProxy, pdfjs } from 'react-pdf';
import { Parser } from '..';
import { getHash } from '../helper';
import { PdfBook } from './book';

const makeThumb = async (page: PDFPageProxy) => {
  const scale = 1.5;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context!,
    viewport,
  };
  await page.render(renderContext).promise;

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
};

/**
 * 解析 toc
 * https://medium.com/@csofiamsousa/creating-a-table-of-contents-with-pdf-js-4a4316472fff
 */
const parseToc = async (
  pdf: pdfjs.PDFDocumentProxy,
  _outline?: Awaited<ReturnType<pdfjs.PDFDocumentProxy['getOutline']>>,
): Promise<IToc[]> => {
  const outline =
    _outline ||
    (await pdf.getOutline())
      ?.filter(Boolean)
      .filter((o) => (typeof o.dest === 'string' ? !!o.dest : !!o.dest?.[0] && !!o.title));
  if (!outline) return [];
  const dest = await Promise.all(
    outline.map((ol) => {
      return typeof ol.dest === 'string' ? pdf.getDestination(ol.dest) : ol.dest;
    }),
  );
  const pages = await Promise.all(dest.map((d) => pdf.getPageIndex(d![0])));
  return Promise.all(
    outline.map((o, i) => {
      const p = async () => {
        const res = {
          title: o.title,
          href: (pages[i] + 1).toString(),
          children: await parseToc(pdf, o.items),
        };
        return res;
      };
      return p();
    }),
  );
};

const parser: Parser<typeof PdfBook> = {
  type: 'pdf',
  Book: PdfBook,
  parse: async (target, cacheInfo = {}) => {
    const pdf =
      target instanceof File
        ? await (
            await pdfjs.getDocument(await target.arrayBuffer())
          ).promise
        : undefined;
    return new PdfBook({
      ...cacheInfo,
      // @ts-ignore
      cover: cacheInfo?.cover || (await makeThumb(await pdf.getPage(1))),
      target,
      title: cacheInfo?.title || getBasenameByFilename(target.name),
      hash: await getHash(cacheInfo, target),
      toc: cacheInfo?.toc || (pdf && (await parseToc(pdf))) || [],
      lastProcess: cacheInfo?.lastProcess || { ts: 0, percent: 0 },
    });
  },
  getCacheableInfo(book) {
    return delFalsy({
      cover: book.cover,
      target: book.target,
      archive: book.archive,
      type: book.type,
      hash: book.hash,
      title: book.title,
      toc: book.toc,
      lastProcess: book.lastProcess,
    });
  },
};

export default parser;
