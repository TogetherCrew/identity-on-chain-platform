import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export interface MenuItem {
  title: string;
  path: string;
  icon: OverridableComponent<SvgIconTypeMap<NonNullable<unknown>, 'svg'>> & {
    muiName: string;
  };
  children?: MenuItem[];
}
