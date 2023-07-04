import { registerParser } from '.';
import EpubParser from '@/parsers/epub';
import PdfParser from '@/parsers/pdf';
import ComicParsers from '@/parsers/comic';

registerParser(EpubParser);
registerParser(PdfParser);
ComicParsers.forEach(registerParser);
