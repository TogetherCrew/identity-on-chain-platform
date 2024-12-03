import React from 'react';
import { Box, Typography } from '@mui/material';

const MobileScreensContainer: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Typography variant="subtitle1" color="primary">
        We are currently not optimized for mobile devices. Please check back on
        a desktop or larger screen.
      </Typography>
    </Box>
  );
};

export default MobileScreensContainer;
