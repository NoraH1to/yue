import Epub, { Spine as _Spine } from 'epubjs';
// import 'epubjs/types/rendition';
import 'epubjs/types/spine';

declare module 'epubjs/types/rendition' {
  import 'epubjs/types/rendition';
  interface RenditionOptions {
    method?: 'default' | 'continuous';
  }
}

type SpineItem = {
  cfiBase: string;
  href: string;
  id: string | null;
  index: number;
  idhref: string;
};

declare module 'epubjs' {
  import { Location } from 'epubjs/types/rendition';
  interface Rendition {
    currentLocation(): Location;
  }

  interface Spine {
    items: SpineItem[];
  }

  interface Book {
    spine: Spine;
  }
}

export default Epub;
