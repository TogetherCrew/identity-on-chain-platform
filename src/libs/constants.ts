import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BlockIcon from '@mui/icons-material/Block';
import { MenuItem } from '../interfaces';

export const DRAWER_WIDTH = 240;

export const SIDEBAR_MENU: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: SpaceDashboardIcon,
  },
  {
    title: 'Identifiers',
    path: '/idenifiers',
    icon: FingerprintIcon,
  },
  {
    title: 'Permissions',
    path: '/permissions',
    icon: BlockIcon,
  },
];
