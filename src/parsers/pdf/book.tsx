import { Promiser, emptyAsyncFn } from '@/helper';
import useResizeObserver from '@/hooks/useResizeObserver';
import {
  ABook,
  IProcess,
  ReaderCompProps,
  TBookConstructorInfo,
} from '@/modules/book/Book';
import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Document, DocumentProps, Page, pdfjs } from 'react-pdf';
import './pdf.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export class PdfBook extends ABook<number | string> {
  type = 'pdf';
  promiser = new Promiser<void>();
  ready = this.promiser.promise;
  totalPage = 0;
  currentPage = 0;
  supportSetting = false;

  constructor(target: TBookConstructorInfo<number | string>) {
    super(target);
  }
  async nextPage(): Promise<void> {
    return;
  }
  async prevPage(): Promise<void> {
    return;
  }
  async jumpTo(page: number): Promise<void> {
    return;
  }
  getPages(): number {
    return this.totalPage;
  }
  getCurrentSectionPages(): number {
    return this.totalPage;
  }
  getCurrentSectionCurrentPage(): number {
    return this.currentPage;
  }
  async getCurrentProcess(): Promise<IProcess<string | number> | null> {
    return {
      value: this.currentPage.toString(),
      percent: this.currentPage / this.totalPage,
      navInfo: this.toc?.findLast((t) => this.currentPage >= parseInt(t.href)),
    };
  }
  async destroy(): Promise<void> {
    return;
  }
  ReaderComponent: FC<ReaderCompProps> = ({ colorMode }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [containerDom, setContainerDom] = useState<HTMLDivElement | null>(
      null,
    );
    const [size, setSize] = useState({ width: 0, height: 0 });
    useResizeObserver(containerDom, ([entry]) => {
      setSize({
        height: entry.contentRect.height,
        width: entry.contentRect.width,
      });
    });

    const onDocumentLoadSuccess: DocumentProps['onLoadSuccess'] = (p) => {
      this.totalPage = p.numPages;
      this.promiser.resolve();
    };

    useEffect(() => {
      this.prevPage = async function () {
        setPageNumber((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
        this.currentPage > 1 ? this.currentPage-- : (this.currentPage = 1);
      };
      this.nextPage = async function () {
        setPageNumber((prevPage) =>
          prevPage < this.totalPage ? prevPage + 1 : this.totalPage,
        );
        this.currentPage < this.totalPage
          ? this.currentPage++
          : (this.currentPage = this.totalPage);
      };
      this.jumpTo = async function (page: number | string) {
        page = parseInt(page.toString());
        page = page === 0 ? 1 : page;
        if (page > this.totalPage) return;
        setPageNumber(page);
        this.currentPage = page;
      };
      return () => {
        this.prevPage = emptyAsyncFn;
        this.nextPage = emptyAsyncFn;
        this.jumpTo = emptyAsyncFn;
      };
    }, [setPageNumber]);

    return (
      <Box
        height={1}
        width="auto"
        ref={setContainerDom}
        sx={
          colorMode === 'dark'
            ? {
                filter: 'brightness(0.7)',
              }
            : undefined
        }>
        <Document
          file={this.target}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={''}>
          <Page
            pageNumber={pageNumber}
            height={size.height}
            loading={''}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </Box>
    );
  };
}
