declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    analyze: string;
    pwa: string;
  }
}
