import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Typography,
  Divider,
  Paper,
  Box,
  Avatar,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const identifiers = [
  { name: 'Discord', icon: FaDiscord, verified: false, color: 'text-blue-500' },
  { name: 'Google', icon: FaGoogle, verified: false, color: 'text-red-500' },
];

export function Identifiers() {
  const navigate = useNavigate();

  const handleRevoke = (identifier: string) => {
    console.log(`Revoke attestation for ${identifier}`);
  };

  const handleConnect = (identifier: string) => {
    console.log(`Connect identifier for ${identifier}`);
    navigate(`/identifiers/${identifier.toLowerCase()}/attestation`);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Identifiers
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Identifier" />
          <ListItemSecondaryAction>
            <Typography variant="body2" style={{ marginRight: 40 }}>
              Actions
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        {identifiers.map((identifier, index) => (
          <Box key={index} mb={2}>
            <Paper elevation={1} className="rounded-xl py-2">
              <ListItem>
                <Avatar>
                  <identifier.icon
                    size={28}
                    className={`${identifier.verified ? 'text-black' : 'text-white'}`}
                  />
                </Avatar>
                <ListItemText
                  primary={
                    <div className="flex items-center">
                      {identifier.verified && (
                        <VerifiedIcon className={'text-blue-400 mr-2'} />
                      )}
                      {identifier.name}
                    </div>
                  }
                  style={{ marginLeft: 16 }}
                />
                <ListItemSecondaryAction>
                  {identifier.verified ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRevoke(identifier.name)}
                    >
                      Revoke
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleConnect(identifier.name)}
                    >
                      Connect
                    </Button>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          </Box>
        ))}
      </List>
    </div>
  );
}

export default Identifiers;
