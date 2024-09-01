import { Provider } from '../../../enums';
import { baseURL } from '..';

interface PlatformAuthenticationParams {
  platformType: Provider;
}

export const platformAuthentication = ({
  platformType,
}: PlatformAuthenticationParams) => {
  window.location.replace(`${baseURL}auth/${platformType}/authenticate`);
};
