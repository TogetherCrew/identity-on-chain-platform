import { ReactNode } from 'react';

export interface MenuItem {
  title: string;
  path: string;
  icon?: ReactNode | JSX.Element;
  children?: MenuItem[];
}
