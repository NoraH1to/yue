import { Promiser } from '@/helper';
import {
  ABook,
  IProcess,
  ReaderCompProps,
  TBookConstructorInfo,
} from '@/modules/book/Book';
import { Box } from '@mui/material';
import { PlainTextViewer } from './TxtParser';
import { FC, useEffect, useState } from 'react';

export type TTxtBookInfo = TBookConstructorInfo<number | string> & {
  plainTextViewer: PlainTextViewer;
};

export class TxtBook extends ABook<number | string> {
  target: Blob;
  type = 'txt';
  promiser = new Promiser<void>();
  ready = this.promiser.promise;
  totalPage = 0;
  currentPage = 0;
  plainTextViewer: PlainTextViewer;

  constructor(target: TTxtBookInfo) {
    super(target);
    this.plainTextViewer = target.plainTextViewer;
    this.target = target.target as File;
  }
  async nextPage(): Promise<void> {
    this.plainTextViewer.next();
  }
  async prevPage(): Promise<void> {
    this.plainTextViewer.prev();
  }
  async jumpTo(page: number): Promise<void> {
    page -= 1;
    this.plainTextViewer.jumpTo(page < 0 ? 0 : page);
  }
  getCurrentPage() {
    return this.plainTextViewer.getLocation().currentPage;
  }
  getPages(): number {
    return this.plainTextViewer.getLocation().totalPage;
  }
  getCurrentSectionPages(): number {
    return this.getPages();
  }
  getCurrentSectionCurrentPage(): number {
    return this.getCurrentPage();
  }
  async getCurrentProcess(): Promise<IProcess<string | number> | null> {
    return {
      value: this.plainTextViewer.getLocation().cfi,
      percent: this.getCurrentPage() / this.getPages(),
    };
  }
  async destroy(): Promise<void> {
    return;
  }
  ReaderComponent: FC<ReaderCompProps> = ({
    colorMode,
    readerSetting,
    readerTheme,
  }) => {
    const [containerDom, setContainerDom] = useState<HTMLDivElement | null>(
      null,
    );
    // TODO: 监听字体设置重新渲染
    useEffect(() => {
      if (!containerDom) return;
      this.plainTextViewer
        .load(this.target)
        .then(() => {
          this.plainTextViewer.render(containerDom);
          this.plainTextViewer.display();
          this.promiser.resolve();
        })
        .catch(this.promiser.reject);
      return () => {
        this.plainTextViewer.destroy();
      };
    }, [containerDom]);

    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          px: {
            md: 4,
            xs: 2,
          },
          fontSize: `${readerSetting.fontSize}px`,
          lineHeight: readerSetting.lineHeight,
          color: readerTheme.color,
          backgroundColor: readerTheme.backgroundColor,
        }}
        ref={setContainerDom}></Box>
    );
  };
}
