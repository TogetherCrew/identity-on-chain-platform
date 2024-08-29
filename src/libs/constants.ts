// import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { SiAdguard } from 'react-icons/si';
import { SvgIconComponent } from '@mui/icons-material';
import { IconType } from 'react-icons';

export interface MenuItem {
  title: string;
  path: string;
  icon: SvgIconComponent | IconType;
}

export const DRAWER_WIDTH = 240;

export const SIDEBAR_MENU: MenuItem[] = [
  // {
  //   title: 'Dashboard',
  //   path: '/',
  //   icon: SpaceDashboardIcon,
  // },
  {
    title: 'Identifiers',
    path: '/identifiers',
    icon: FingerprintIcon,
  },
  {
    title: 'Permissions',
    path: '/permissions',
    icon: SiAdguard,
  },
];
