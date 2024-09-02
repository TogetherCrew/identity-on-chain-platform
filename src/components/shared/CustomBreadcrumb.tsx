import * as React from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import Breadcrumbs, { BreadcrumbsProps } from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: SvgIconComponent;
}

interface CustomBreadcrumbProps extends BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({
  breadcrumbs,
  ...props
}) => {
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb" separator=">" {...props}>
        {breadcrumbs.map((breadcrumb) =>
          breadcrumb.href ? (
            <Link
              key={breadcrumb.label}
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href={breadcrumb.href}
            >
              {breadcrumb.icon && (
                <breadcrumb.icon sx={{ mr: 0.5 }} fontSize="inherit" />
              )}
              {breadcrumb.label}
            </Link>
          ) : (
            <Typography
              key={breadcrumb.label}
              sx={{
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {breadcrumb.icon && (
                <breadcrumb.icon sx={{ mr: 0.5 }} fontSize="inherit" />
              )}
              {breadcrumb.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </div>
  );
};

export default CustomBreadcrumb;
