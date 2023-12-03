import { Promiser } from '@/helper';
import { ABook, IProcess, ReaderCompProps, TBookConstructorInfo } from '@/modules/book/Book';
import { Box } from '@mui/material';
import { FilesObject } from 'libarchive.js/src/libarchive';
import { FC, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/virtual';
import { Virtual } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import MemoImgViewer from './MemoImgViewer';
import './swiper.css';

export type TComicBookInfo = TBookConstructorInfo<number | string> & {
  archive: FilesObject;
};

export class ComicBook extends ABook<number | string> {
  type = 'comic';
  promiser = new Promiser<void>();
  ready = this.promiser.promise;
  totalPage = 0;
  currentPage = 0;
  supportSetting = false;
  archive: FilesObject;
  swiper?: SwiperClass;

  constructor(target: TComicBookInfo) {
    super(target);
    this.archive = target.archive;
    this.totalPage = Object.keys(this.archive).length;
  }
  async nextPage(): Promise<void> {
    if (!this.swiper) return;
    if (!this.swiper.isEnd) {
      this.swiper.slideNext();
    }
  }
  async prevPage(): Promise<void> {
    if (!this.swiper) return;
    if (!this.swiper.isBeginning) {
      this.swiper.slidePrev();
    }
  }
  async jumpTo(page: number): Promise<void> {
    if (!this.swiper) return;
    this.swiper.slideTo(page === 0 ? 0 : page - 1);
  }
  getCurrentPage() {
    return this.currentPage;
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
      value: this.currentPage,
      percent: this.currentPage / this.totalPage,
      navInfo: this.toc?.findLast((t) => this.currentPage >= parseInt(t.href)),
    };
  }
  async destroy(): Promise<void> {
    return;
  }
  ReaderComponent: FC<ReaderCompProps> = () => {
    const [swiper, setSwiper] = useState<SwiperClass>();
    useEffect(() => {
      if (!swiper) return;
      this.currentPage = 1;
      this.swiper = swiper;
      this.promiser.resolve();
    }, [swiper]);
    return (
      <Box height={1}>
        <Swiper
          modules={[Virtual]}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => (this.currentPage = swiper.activeIndex + 1)}
          onSwiper={setSwiper}
          virtual={true}>
          {Object.keys(this.archive).map((filename, i) => (
            <SwiperSlide key={filename} virtualIndex={i}>
              <MemoImgViewer img={this.archive[filename] as File} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    );
  };
}
