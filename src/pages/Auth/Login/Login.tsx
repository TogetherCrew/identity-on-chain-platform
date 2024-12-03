import { Box, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Login() {
  return (
    <div className="h-screen w-full flex">
      <Box className="w-1/4 p-8 flex flex-col justify-center items-center shadow-2xl">
        <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
          Welcome to LogID
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please connect your wallet to continue.
        </Typography>
        <div className="py-3">
          <ConnectButton />
        </div>
      </Box>
      <Box
        className="w-3/4 h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(/img/login.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
}
