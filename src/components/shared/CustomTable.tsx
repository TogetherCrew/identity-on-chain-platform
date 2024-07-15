import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Typography, Card } from '@mui/material';
import AccessControlButton from './AccessControlButton';

export interface Platform {
    name: string;
    icon: React.ReactNode;
}

export interface AccessData {
    application: string;
    [platform: string]: boolean | string;
}

export interface Column<T> {
    field: keyof T;
    headerName?: string;
    headerComponent?: React.ReactNode;
    renderCell?: (value: any, row: T) => React.ReactNode;
}

export interface CustomTableProps<T> {
    xcolumns: Platform[];
    ycolumns: T[];
    data: T[];
}

const CustomTable: React.FC<CustomTableProps<AccessData>> = ({ xcolumns, ycolumns, data }) => {
    const handleToggleAccess = (rowIndex: number, platform: string) => {
        // Implement the logic to toggle access
        console.log(`Toggle access for row ${rowIndex}, platform ${platform}`);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow component={Card}>
                        <TableCell sx={{ padding: 1 }} align="center">
                            <Typography fontWeight="bold">
                                Applications \ Identifiers
                            </Typography>
                        </TableCell>
                        {xcolumns.map((platform, index) => (
                            <TableCell key={index} align="center" sx={{ padding: 1 }}>
                                <div className="flex flex-row space-x-1.5 items-center justify-center">
                                    <Avatar>
                                        {platform.icon}
                                    </Avatar>
                                    <Typography>{platform.name}</Typography>
                                </div>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ycolumns.map((application, rowIndex) => (
                        <TableRow component={Card} key={rowIndex}>
                            <TableCell align="center" sx={{ padding: 1 }}>
                                <div className='flex flex-col items-center justify-center text-center mx-auto space-y-2'>
                                    <Avatar />
                                    <Typography>
                                        {application.application}
                                    </Typography>
                                </div>
                            </TableCell>
                            {xcolumns.map((platform, colIndex) => (
                                <TableCell key={colIndex} align="center">
                                    <AccessControlButton
                                        hasAccess={data[rowIndex][platform.name] as boolean}
                                        onToggleAccess={() => handleToggleAccess(rowIndex, platform.name)}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
