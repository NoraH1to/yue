export type INode = {
  tag: keyof HTMLElementTagNameMap;
  content?: string | INode[];
  props?: Record<string, string | number | boolean>;
};

export const nodeList2ElList = (nodeList: INode[]): Element[] => {
  return nodeList.map(({ tag, content, props }) => {
    const el = document.createElement(tag);
    el.append(...(typeof content === 'string' ? [content] : nodeList2ElList(content || [])));
    return el;
  });
};
