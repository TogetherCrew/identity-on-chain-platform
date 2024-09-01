import { PlatformAuthenticationParams } from '@/interfaces';
import { baseURL } from '..';

export const platformAuthentication = async ({
  platformType,
}: PlatformAuthenticationParams) => {
  window.location.replace(`${baseURL}auth/${platformType}/authenticate`);
};
