import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Card,
} from '@mui/material';
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
  console.log('xcolumns:', xcolumns);
  console.log('ycolumns:', ycolumns);

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
                  <Avatar>{platform.provider[0].toUpperCase()}</Avatar>
                  <Typography>{platform.provider}</Typography>
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
                  <div className="flex flex-col items-center justify-center text-center mx-auto space-y-2">
                    <Avatar />
                    <Typography>{applicationName}</Typography>
                  </div>
                </TableCell>
                {xcolumns.map((platform, colIndex) => {
                  const application = applications.find(
                    (app) => app.uid === platform.uid
                  );
                  return (
                    <TableCell key={colIndex} align="center">
                      <AccessControlButton
                        hasAccess={application?.hasPermission || false}
                        onToggleAccess={() =>
                          handleToggleAccess(application!, platform)
                        }
                      />
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
