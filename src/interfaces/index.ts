import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export interface MenuItem {
  title: string;
  path: string;
  icon: OverridableComponent<SvgIconTypeMap<NonNullable<unknown>, 'svg'>> & {
    muiName: string;
  };
  children?: MenuItem[];
}

export interface PlatformAuthenticationParams {
  platformType: 'DISCORD' | 'GOOGLE';
}

interface Domain {
  chainId: bigint;
  name: string;
  verifyingContract: string;
  version: string;
}

interface AttestMessage {
  attester: string;
  data: string;
  expirationTime: bigint;
  nonce: bigint;
  recipient: string;
  refUID: string;
  revocable: boolean;
  schema: string;
}

interface Signature {
  r: string;
  s: string;
  v: number;
}

interface TypeItem {
  name: string;
  type: string;
}

interface Types {
  Attest: TypeItem[];
}

export interface AttestPayload {
  domain: Domain;
  message: AttestMessage;
  primaryType: string;
  signature: Signature;
  types: Types;
}
