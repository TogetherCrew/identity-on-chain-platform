import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box, Typography } from '@mui/material';

export function Login() {
  return (
    <div className="h-screen w-full flex">
      <Box className="w-1/4 p-8 flex flex-col justify-center items-center shadow-2xl">
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Welcome to OnChain
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
          backgroundImage: 'url(../../../../public/img/login.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
}
