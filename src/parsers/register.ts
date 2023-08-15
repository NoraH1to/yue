import { registerParser } from '.';
import EpubParser from '@/parsers/epub';
import PdfParser from '@/parsers/pdf';
import ComicParsers from '@/parsers/comic';
import TxtParser from '@/parsers/txt';

registerParser(EpubParser);
registerParser(PdfParser);
ComicParsers.forEach(registerParser);
registerParser(TxtParser);
