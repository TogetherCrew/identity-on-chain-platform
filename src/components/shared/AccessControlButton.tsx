// AccessControlButton.tsx
import React from 'react';
import { Button } from '@mui/material';

interface AccessControlButtonProps {
    hasAccess: boolean;
    onToggleAccess: () => void;
}

const AccessControlButton: React.FC<AccessControlButtonProps> = ({ hasAccess, onToggleAccess }) => {
    return (
        <Button
            variant="contained"
            color={hasAccess ? 'secondary' : 'primary'}
            onClick={onToggleAccess}
        >
            {hasAccess ? 'Revoke Access' : 'Grant Access'}
        </Button>
    );
};

export default AccessControlButton;
