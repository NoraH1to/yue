import { nodeList2ElList } from './Node';
import Parser from './Parser';

export type ILocation = {
  cfi: string;
  currentPage: number;
  totalPage: number;
};

export default class Viewer {
  private containerEl?: HTMLDivElement;
  private targetEl: HTMLElement | null = null;
  location: ILocation = {
    cfi: ':0',
    currentPage: 1,
    totalPage: 1,
  };
  private locationNode?: {
    el?: HTMLElement;
    index: number;
  };

  constructor(private parser: Parser) {}

  render(el: string | HTMLElement) {
    if (!this.parser.nodeList) throw new Error('Need load content before render.');
    this.targetEl && (this.targetEl.innerHTML = '');
    this.targetEl = el instanceof Element ? el : document.querySelector(el);
    const container = this.containerEl || (this.containerEl = document.createElement('div'));
    container.innerHTML = '';
    container.style.opacity = '0';
    container.append(...nodeList2ElList(this.parser.nodeList));
    this.targetEl!.innerHTML = '';
    this.targetEl!.append(this.containerEl);
    this.updateContainerStyle(this.containerEl);
    this.updateLocation(true);
    // TODO: listen resize
  }

  display(index?: number | string) {
    this.containerEl && (this.containerEl.style.opacity = '1');
    return this.jumpTo(index || 0);
  }

  next() {
    return this.jumpPage(1);
  }

  prev() {
    return this.jumpPage(-1);
  }

  jumpTo(index: number | string): ILocation {
    if (!this.targetEl?.innerHTML) return this.display(index);
    if (typeof index === 'number') {
      index = Math.round(index);
      this.jumpPage(-this.location.currentPage + 1);
      return this.jumpPage(index);
    } else {
      index = parseInt(index.split(':')[1]);
      (
        Array.prototype.find.call(
          this.containerEl?.children,
          (v: Element, i: number) => i === index,
        ) as Element | undefined
      )?.scrollIntoView();
      return this.updateLocation(this.location.currentPage < index + 1);
    }
  }

  destroy() {
    this.containerEl && (this.containerEl.innerHTML = '');
  }

  private jumpPage(step: number, smooth?: boolean) {
    if (!this.containerEl) return this.location;
    const newPage = this.location.currentPage + step;
    if (newPage < 1 || newPage > this.location.totalPage) return this.updateLocation(true);
    this.containerEl.scrollBy({
      top: 0,
      left: (this.containerEl as HTMLElement).offsetWidth * step,
      behavior: smooth ? 'smooth' : 'auto',
    });
    this.location.currentPage = newPage;
    this.updateLocation(step >= 0);
    // 消除误差
    this.locationNode?.el?.scrollIntoView();
    return this.location;
  }

  private updateLocation(next: boolean) {
    if (!this.containerEl) return this.location;
    const startNode = this.locationNode?.el || (this.containerEl.children[0] as HTMLElement);
    let index = this.locationNode?.index || 0;
    if (!next && index === 0) {
      this.locationNode = {
        el: startNode,
        index,
      };
      this.location = {
        ...this.location,
        currentPage: 1,
        cfi: ':0',
      };
    } else {
      while (index >= 0 && index < this.containerEl.children.length) {
        const offsetLeft = Math.round(
          this.containerEl.children[index].getBoundingClientRect().left -
            this.containerEl.getBoundingClientRect().left,
        );
        if (offsetLeft >= -5 && offsetLeft <= 5) {
          this.locationNode = {
            el: this.containerEl.children[index] as HTMLElement,
            index,
          };
          this.location = {
            ...this.location,
            cfi: `:${index}`,
            currentPage:
              Math.round(
                ((this.containerEl.children[index] as HTMLElement).offsetLeft -
                  this.containerEl.offsetLeft) /
                  this.containerEl.offsetWidth,
              ) + 1,
          };
          break;
        }
        next ? index++ : index--;
      }
    }
    this.location.totalPage = Math.round(
      this.containerEl.scrollWidth / this.containerEl.offsetWidth,
    );
    return this.location;
  }

  private updateContainerStyle(container: HTMLDivElement) {
    if (!this.targetEl) return;
    container.style.width = this.targetEl.computedStyleMap().get('width')!.toString();
    container.style.height = this.targetEl.computedStyleMap().get('height')!.toString();
    container.style.overflow = 'hidden';
    container.style.columnFill = 'auto';
    container.style.columnWidth = `${(this.targetEl as HTMLElement).offsetWidth}px`;
    container.style.columnGap = '0px';
  }
}
