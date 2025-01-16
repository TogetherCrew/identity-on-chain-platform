import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FaDiscourse } from 'react-icons/fa';

import { useVerifyDiscourseTopicMutation } from '../../../../services/api/eas/query';
import useSnackbarStore from '../../../../store/useSnackbarStore';

interface DiscourseStepTwoProps {
  handleNextStep: () => void;
}

const DiscourseStepTwo: React.FC<DiscourseStepTwoProps> = ({
  handleNextStep,
}) => {
  const { showSnackbar } = useSnackbarStore();
  const { mutate: mutateVerifyDiscourseTopicUrl, isPending } =
    useVerifyDiscourseTopicMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{ topicUrl: string }>();
  const [verificationCode] = useState(() => {
    return (
      localStorage.getItem('DISCOURSE_VERIFICATION_CODE') ||
      'YOUR-VERIFICATION-CODE'
    );
  });

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(verificationCode);
      showSnackbar('Verification code copied to clipboard', {
        severity: 'success',
      });
    } catch (error) {
      showSnackbar('Failed to copy verification code to clipboard', {
        severity: 'error',
      });
    }
  };

  const onSubmit = (data: { topicUrl: string }) => {
    const verificationJwt = localStorage.getItem(
      'DISCOURSE_VERIFICATION_TOKEN'
    ) as string;

    mutateVerifyDiscourseTopicUrl(
      {
        topicUrl: data.topicUrl,
        verificationJwt,
      },
      {
        onSuccess: (response) => {
          const { discourseJwt } = response.data;

          localStorage.setItem('DISCOURSE_JWT', discourseJwt);

          handleNextStep();
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          py: 12,
          maxWidth: 400,
          mx: 'auto',
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Verify Topic URL
        </Typography>
        <Typography variant="body2">
          Please verify the topic URL on Discourse by entering the URL below.
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Controller
            name="topicUrl"
            control={control}
            rules={{
              required: 'Topic URL is required',
              pattern: {
                value:
                  /^(https?:\/\/(?:www\.)?(?:[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b)(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*))$/,
                message: 'Please enter a valid URL',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Topic URL"
                variant="filled"
                fullWidth
                error={!!errors.topicUrl}
                helperText={errors.topicUrl?.message}
              />
            )}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <TextField
            label="Verification Code"
            variant="filled"
            fullWidth
            value={verificationCode}
            disabled
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={copyToClipboard}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              ),
            }}
            helperText="Create a topic and put this code in the content."
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          startIcon={<FaDiscourse />}
          fullWidth
          disabled={isPending}
          size="large"
        >
          {isPending ? 'Verifying...' : 'Verify and Continue'}
        </Button>
      </Stack>
    </form>
  );
};

export default DiscourseStepTwo;
