import { baseURL } from '..';
import { PlatformAuthenticationParams } from '@/interfaces';

export const platformAuthentication = async ({
  platformType,
}: PlatformAuthenticationParams) => {
  window.location.replace(`${baseURL}auth/${platformType}/authenticate`);
};
