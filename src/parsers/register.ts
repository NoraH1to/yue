import { registerParser } from '.';
import EpubParser from '@/parsers/epub';
import PdfParser from '@/parsers/pdf';

registerParser(EpubParser);
registerParser(PdfParser);
