import detectFileEncodingAndLanguage from 'detect-file-encoding-and-language/src/index-browser';
import toArrayBuffer from 'to-array-buffer';
import { INode } from './Node';
import {
  ERROR_WORKER,
  IMessage,
  MSG_POST_MAIN,
  MSG_POST_WORKER,
  createPostMsg,
} from './utils/postMsg';

const isWrapOrEnter = (str: string) => str === '\n' || str === '\r';

onmessage = ({ data: { type, data } }: MessageEvent<IMessage>) => {
  switch (type) {
    case MSG_POST_MAIN.RAW_CONTENT:
      handleRawContent(data as string);
      break;
    default:
      break;
  }
};

const handleRawContent = async (content: string | Blob) => {
  if (typeof content === 'string') {
    if (!content.length)
      return postMessage(
        createPostMsg(
          MSG_POST_WORKER.RAW_CONTENT_ERROR,
          new Error(ERROR_WORKER.RAW_CONTENT_EMPTY),
        ),
      );
    content = new Blob([toArrayBuffer(content)]);
  }
  const nodeList: INode[] = [];
  const reader = new FileReader();
  reader.onload = () => {
    const content = reader.result as string;
    let start = 0;
    let end = 0;
    while (end < content.length) {
      while (end < content.length && !isWrapOrEnter(content[end])) end++;
      if (end - start > 0) {
        nodeList.push({
          tag: 'p',
          content: content.slice(start, end),
        });
        start = end;
      }
      while (end < content.length && isWrapOrEnter(content[end])) end++;
    }
    postMessage(createPostMsg(MSG_POST_WORKER.NODE_DATA, nodeList));
  };
  const fileInfo = await detectFileEncodingAndLanguage(content);
  reader.readAsText(content, fileInfo.encoding);
};
