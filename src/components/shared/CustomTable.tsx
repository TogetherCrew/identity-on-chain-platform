/* eslint-disable react/no-array-index-key */
import {
  Avatar,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FaDiscord, FaGoogle } from 'react-icons/fa';

import { capitalize } from '../../utils/helper';

import AccessControlButton from './AccessControlButton';

export interface Platform {
  id: string;
  provider: string;
  uid: string;
}

export interface AccessData {
  applicationName: string;
  account: string;
  hasPermission: boolean;
  uid: string;
}

export interface CustomTableProps<T> {
  xcolumns: Platform[];
  ycolumns: T[];
  handleGrantOrRevokeAccess: (application: T, platform: Platform) => void;
}

const CustomTable: React.FC<CustomTableProps<AccessData>> = ({
  xcolumns,
  ycolumns,
  handleGrantOrRevokeAccess,
}) => {
  const groupedApplications = ycolumns.reduce(
    (acc, application) => {
      if (!acc[application.applicationName]) {
        acc[application.applicationName] = [];
      }
      acc[application.applicationName].push(application);
      return acc;
    },
    {} as Record<string, AccessData[]>
  );

  const handleToggleAccess = (application: AccessData, platform: Platform) => {
    handleGrantOrRevokeAccess(application, platform);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow component={Card}>
            <TableCell sx={{ padding: 1 }} align="center">
              <Typography fontWeight="bold">
                Applications \ Providers
              </Typography>
            </TableCell>
            {xcolumns.map((platform, index) => (
              <TableCell key={index} align="center" sx={{ padding: 1 }}>
                <div className="flex flex-row space-x-1.5 items-center justify-center">
                  <Avatar>
                    {platform.provider === 'discord' ? (
                      <FaDiscord size={24} />
                    ) : (
                      <FaGoogle size={24} />
                    )}
                  </Avatar>
                  <Typography>{capitalize(platform.provider)}</Typography>
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groupedApplications).map(
            ([applicationName, applications], rowIndex) => (
              <TableRow component={Card} key={rowIndex}>
                <TableCell align="center" sx={{ padding: 1 }}>
                  <div className="flex flex-row items-center justify-center text-center mx-auto space-x-3">
                    <Avatar />
                    <Typography>{capitalize(applicationName)}</Typography>
                  </div>
                </TableCell>
                {xcolumns.map((platform, colIndex) => {
                  const application = applications.find(
                    (app) => app.uid === platform.uid
                  );
                  return (
                    <TableCell key={colIndex} align="center">
                      {application ? (
                        <AccessControlButton
                          hasAccess={application.hasPermission}
                          onToggleAccess={() =>
                            handleToggleAccess(application, platform)
                          }
                        />
                      ) : (
                        <Typography variant="body2">No Data</Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
