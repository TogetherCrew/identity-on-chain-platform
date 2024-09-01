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

export interface IAttestation {
  uid: `0x${string}`;
  schema: `0x${string}`;
  refUID: `0x${string}`;
  time: bigint;
  expirationTime: bigint;
  revocationTime: bigint;
  recipient: `0x${string}`;
  attester: `0x${string}`;
  revocable: boolean;
  data: `0x${string}`;
  id?: string;
  provider?: string;
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

export interface AttestMessage {
  attester?: string;
  data: string;
  expirationTime: bigint;
  nonce: bigint;
  recipient: string;
  refUID: string;
  revocable: boolean;
  schema: string;
}

export interface RevokeMessage {
  nonce: string;
  revoker: string;
  schema: string;
  uid: string;
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

export interface RevokePayload {
  domain: Domain;
  message: RevokeMessage;
  primaryType: string;
  signature: Signature;
  types: Types;
}
