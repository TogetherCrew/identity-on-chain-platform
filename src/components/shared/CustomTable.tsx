// CustomTable.tsx
import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import AccessControlButton from './AccessControlButton';


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
    xcolumns: string[];
    ycolumns: T[];
    data: T[];
}

const CustomTable: React.FC<CustomTableProps<AccessData>> = ({ xcolumns, ycolumns, data }) => {
    const handleToggleAccess = (rowIndex: number, platform: string) => {
        // Implement the logic to toggle access
        console.log(`Toggle access for row ${rowIndex}, platform ${platform}`);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell /> {/* Empty cell for the top-left corner */}
                        {xcolumns.map((platform, index) => (
                            <TableCell key={index} align="center">{platform}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ycolumns.map((application, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell align="center">{application.application}</TableCell>
                            {xcolumns.map((platform, colIndex) => (
                                <TableCell key={colIndex} align="center">
                                    <AccessControlButton
                                        hasAccess={data[rowIndex][platform] as boolean}
                                        onToggleAccess={() => handleToggleAccess(rowIndex, platform)}
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
