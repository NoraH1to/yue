export interface IToc<T = string> {
  title: string;
  href: T;
  children?: IToc[];
}
