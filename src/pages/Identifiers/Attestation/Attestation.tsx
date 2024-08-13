import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import StepperComponent from '../../../components/shared/CustomStepper';
import { platformAuthentication } from '../../../services/api/auth';
import { useLinkIdentifierMutation } from '../../../services/api/linking/query';
import { Address, getContract, http } from 'viem';
import { SUPPORTED_CHAINS } from '../../../contracts/chains/chains.constants';
import { useWriteContract, useReadContract, useSimulateContract } from 'wagmi';

const steps = [{ label: 'Auth' }, { label: 'Attest' }, { label: 'Transact' }];

type Provider = 'DISCORD' | 'GOOGLE';
type Token = { token: string; exp: number; provider: Provider };
type DecodedToken = { provider: Provider; iat: number; exp: number };

export function Attestation() {
  const { writeContract, error } = useWriteContract();
  useSimulateContract();

  const { provider } = useParams<{ provider: 'DISCORD' | 'GOOGLE' }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: mutateIdentifier, data } = useLinkIdentifierMutation();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
  };

  useEffect(() => {
    if (data) {
      handleNext();
    }
  }, [data]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const jwtToken = searchParams.get('jwt');

    if (jwtToken) {
      try {
        const decoded: DecodedToken = jwtDecode(jwtToken);
        const { provider: jwtProvider } = decoded;

        const existingTokens: Token[] = JSON.parse(
          localStorage.getItem('OCI_PROVIDER_TOKENS') || '[]'
        );
        const updatedTokens = existingTokens.filter(
          (token) => token.provider !== jwtProvider
        );

        updatedTokens.push({
          token: jwtToken,
          exp: decoded.exp,
          provider: jwtProvider,
        });
        localStorage.setItem(
          'OCI_PROVIDER_TOKENS',
          JSON.stringify(updatedTokens)
        );

        navigate(location.pathname, { replace: true });

        setActiveStep(1);
      } catch (error) {
        console.error('Invalid JWT token:', error);
      }
    }
  }, [location.search, location.pathname, navigate]);

  const handleAuthorize = () => {
    if (!provider) return;
    platformAuthentication({ platformType: provider });
  };

  const getTokenForProvider = (jwtProvider: string) => {
    const tokens =
      JSON.parse(localStorage.getItem('OCI_PROVIDER_TOKENS') || '') || [];
    const tokenObject = tokens.find(
      (token: { provider: string }) =>
        token.provider.toLowerCase() === jwtProvider.toLowerCase()
    );
    return tokenObject ? tokenObject.token : null;
  };

  // const eas = getContract({
  //   address: SUPPORTED_CHAINS[0].easContractAddress as Address,
  //   abi: SUPPORTED_CHAINS[0].easContractAbi,
  // });

  // const attest = async () => {
  //   const request = {};

  //   eas.write.attestByDelegation([request], {
  //     account: '',
  //   });
  // };

  const handleAttest = () => {
    console.log('start');

    writeContract({
      abi: [
        {
          inputs: [
            {
              internalType: 'contract ISchemaRegistry',
              name: 'registry',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        { inputs: [], name: 'AccessDenied', type: 'error' },
        { inputs: [], name: 'AlreadyRevoked', type: 'error' },
        { inputs: [], name: 'AlreadyRevokedOffchain', type: 'error' },
        { inputs: [], name: 'AlreadyTimestamped', type: 'error' },
        { inputs: [], name: 'InsufficientValue', type: 'error' },
        { inputs: [], name: 'InvalidAttestation', type: 'error' },
        { inputs: [], name: 'InvalidAttestations', type: 'error' },
        { inputs: [], name: 'InvalidExpirationTime', type: 'error' },
        { inputs: [], name: 'InvalidLength', type: 'error' },
        { inputs: [], name: 'InvalidOffset', type: 'error' },
        { inputs: [], name: 'InvalidRegistry', type: 'error' },
        { inputs: [], name: 'InvalidRevocation', type: 'error' },
        { inputs: [], name: 'InvalidRevocations', type: 'error' },
        { inputs: [], name: 'InvalidSchema', type: 'error' },
        { inputs: [], name: 'InvalidSignature', type: 'error' },
        { inputs: [], name: 'InvalidVerifier', type: 'error' },
        { inputs: [], name: 'Irrevocable', type: 'error' },
        { inputs: [], name: 'NotFound', type: 'error' },
        { inputs: [], name: 'NotPayable', type: 'error' },
        { inputs: [], name: 'WrongSchema', type: 'error' },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'attester',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'bytes32',
              name: 'uid',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'schema',
              type: 'bytes32',
            },
          ],
          name: 'Attested',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'attester',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'bytes32',
              name: 'uid',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'schema',
              type: 'bytes32',
            },
          ],
          name: 'Revoked',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'revoker',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'data',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'uint64',
              name: 'timestamp',
              type: 'uint64',
            },
          ],
          name: 'RevokedOffchain',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'data',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'uint64',
              name: 'timestamp',
              type: 'uint64',
            },
          ],
          name: 'Timestamped',
          type: 'event',
        },
        {
          inputs: [],
          name: 'VERSION',
          outputs: [{ internalType: 'string', name: '', type: 'string' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      internalType: 'address',
                      name: 'recipient',
                      type: 'address',
                    },
                    {
                      internalType: 'uint64',
                      name: 'expirationTime',
                      type: 'uint64',
                    },
                    {
                      internalType: 'bool',
                      name: 'revocable',
                      type: 'bool',
                    },
                    {
                      internalType: 'bytes32',
                      name: 'refUID',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'bytes',
                      name: 'data',
                      type: 'bytes',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  internalType: 'struct AttestationRequestData',
                  name: 'data',
                  type: 'tuple',
                },
              ],
              internalType: 'struct AttestationRequest',
              name: 'request',
              type: 'tuple',
            },
          ],
          name: 'attest',
          outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      internalType: 'address',
                      name: 'recipient',
                      type: 'address',
                    },
                    {
                      internalType: 'uint64',
                      name: 'expirationTime',
                      type: 'uint64',
                    },
                    {
                      internalType: 'bool',
                      name: 'revocable',
                      type: 'bool',
                    },
                    {
                      internalType: 'bytes32',
                      name: 'refUID',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'bytes',
                      name: 'data',
                      type: 'bytes',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  internalType: 'struct AttestationRequestData',
                  name: 'data',
                  type: 'tuple',
                },
                {
                  components: [
                    {
                      internalType: 'uint8',
                      name: 'v',
                      type: 'uint8',
                    },
                    {
                      internalType: 'bytes32',
                      name: 'r',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'bytes32',
                      name: 's',
                      type: 'bytes32',
                    },
                  ],
                  internalType: 'struct EIP712Signature',
                  name: 'signature',
                  type: 'tuple',
                },
                {
                  internalType: 'address',
                  name: 'attester',
                  type: 'address',
                },
              ],
              internalType: 'struct DelegatedAttestationRequest',
              name: 'delegatedRequest',
              type: 'tuple',
            },
          ],
          name: 'attestByDelegation',
          outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getAttestTypeHash',
          outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          stateMutability: 'pure',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'bytes32', name: 'uid', type: 'bytes32' }],
          name: 'getAttestation',
          outputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'uid',
                  type: 'bytes32',
                },
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  internalType: 'uint64',
                  name: 'time',
                  type: 'uint64',
                },
                {
                  internalType: 'uint64',
                  name: 'expirationTime',
                  type: 'uint64',
                },
                {
                  internalType: 'uint64',
                  name: 'revocationTime',
                  type: 'uint64',
                },
                {
                  internalType: 'bytes32',
                  name: 'refUID',
                  type: 'bytes32',
                },
                {
                  internalType: 'address',
                  name: 'recipient',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'attester',
                  type: 'address',
                },
                {
                  internalType: 'bool',
                  name: 'revocable',
                  type: 'bool',
                },
                {
                  internalType: 'bytes',
                  name: 'data',
                  type: 'bytes',
                },
              ],
              internalType: 'struct Attestation',
              name: '',
              type: 'tuple',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getDomainSeparator',
          outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'getNonce',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'revoker',
              type: 'address',
            },
            { internalType: 'bytes32', name: 'data', type: 'bytes32' },
          ],
          name: 'getRevokeOffchain',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getRevokeTypeHash',
          outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
          stateMutability: 'pure',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getSchemaRegistry',
          outputs: [
            {
              internalType: 'contract ISchemaRegistry',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'bytes32', name: 'data', type: 'bytes32' }],
          name: 'getTimestamp',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'bytes32', name: 'uid', type: 'bytes32' }],
          name: 'isAttestationValid',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      internalType: 'address',
                      name: 'recipient',
                      type: 'address',
                    },
                    {
                      internalType: 'uint64',
                      name: 'expirationTime',
                      type: 'uint64',
                    },
                    {
                      internalType: 'bool',
                      name: 'revocable',
                      type: 'bool',
                    },
                    {
                      internalType: 'bytes32',
                      name: 'refUID',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'bytes',
                      name: 'data',
                      type: 'bytes',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  internalType: 'struct AttestationRequestData[]',
                  name: 'data',
                  type: 'tuple[]',
                },
              ],
              internalType: 'struct MultiAttestationRequest[]',
              name: 'multiRequests',
              type: 'tuple[]',
            },
          ],
          name: 'multiAttest',
          outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      internalType: 'address',
                      name: 'recipient',
                      type: 'address',
                    },
                    {
                      internalType: 'uint64',
                      name: 'expirationTime',
                      type: 'uint64',
                    },
                    {
                      internalType: 'bool',
                      name: 'revocable',
                      type: 'bool',
                    },
                    {
                      internalType: 'bytes32',
                      name: 'refUID',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'bytes',
                      name: 'data',
                      type: 'bytes',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  internalType: 'struct AttestationRequestData[]',
                  name: 'data',
                  type: 'tuple[]',
                },
                {
                  components: [
                    {
                      internalType: 'uint8',
                      name: 'v',
                      type: 'uint8',
                    },
                    {
                      internalType: 'bytes32',
                      name: 'r',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'bytes32',
                      name: 's',
                      type: 'bytes32',
                    },
                  ],
                  internalType: 'struct EIP712Signature[]',
                  name: 'signatures',
                  type: 'tuple[]',
                },
                {
                  internalType: 'address',
                  name: 'attester',
                  type: 'address',
                },
              ],
              internalType: 'struct MultiDelegatedAttestationRequest[]',
              name: 'multiDelegatedRequests',
              type: 'tuple[]',
            },
          ],
          name: 'multiAttestByDelegation',
          outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      internalType: 'bytes32',
                      name: 'uid',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  internalType: 'struct RevocationRequestData[]',
                  name: 'data',
                  type: 'tuple[]',
                },
              ],
              internalType: 'struct MultiRevocationRequest[]',
              name: 'multiRequests',
              type: 'tuple[]',
            },
          ],
          name: 'multiRevoke',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      internalType: 'bytes32',
                      name: 'uid',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  internalType: 'struct RevocationRequestData[]',
                  name: 'data',
                  type: 'tuple[]',
                },
                {
                  components: [
                    {
                      internalType: 'uint8',
                      name: 'v',
                      type: 'uint8',
                    },
                    {
                      internalType: 'bytes32',
                      name: 'r',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'bytes32',
                      name: 's',
                      type: 'bytes32',
                    },
                  ],
                  internalType: 'struct EIP712Signature[]',
                  name: 'signatures',
                  type: 'tuple[]',
                },
                {
                  internalType: 'address',
                  name: 'revoker',
                  type: 'address',
                },
              ],
              internalType: 'struct MultiDelegatedRevocationRequest[]',
              name: 'multiDelegatedRequests',
              type: 'tuple[]',
            },
          ],
          name: 'multiRevokeByDelegation',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32[]',
              name: 'data',
              type: 'bytes32[]',
            },
          ],
          name: 'multiRevokeOffchain',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'bytes32[]',
              name: 'data',
              type: 'bytes32[]',
            },
          ],
          name: 'multiTimestamp',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      internalType: 'bytes32',
                      name: 'uid',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  internalType: 'struct RevocationRequestData',
                  name: 'data',
                  type: 'tuple',
                },
              ],
              internalType: 'struct RevocationRequest',
              name: 'request',
              type: 'tuple',
            },
          ],
          name: 'revoke',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'bytes32',
                  name: 'schema',
                  type: 'bytes32',
                },
                {
                  components: [
                    {
                      internalType: 'bytes32',
                      name: 'uid',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  internalType: 'struct RevocationRequestData',
                  name: 'data',
                  type: 'tuple',
                },
                {
                  components: [
                    {
                      internalType: 'uint8',
                      name: 'v',
                      type: 'uint8',
                    },
                    {
                      internalType: 'bytes32',
                      name: 'r',
                      type: 'bytes32',
                    },
                    {
                      internalType: 'bytes32',
                      name: 's',
                      type: 'bytes32',
                    },
                  ],
                  internalType: 'struct EIP712Signature',
                  name: 'signature',
                  type: 'tuple',
                },
                {
                  internalType: 'address',
                  name: 'revoker',
                  type: 'address',
                },
              ],
              internalType: 'struct DelegatedRevocationRequest',
              name: 'delegatedRequest',
              type: 'tuple',
            },
          ],
          name: 'revokeByDelegation',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'bytes32', name: 'data', type: 'bytes32' }],
          name: 'revokeOffchain',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [{ internalType: 'bytes32', name: 'data', type: 'bytes32' }],
          name: 'timestamp',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      address: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e' as Address,
      functionName: 'attestByDelegation',
      args: [
        {
          signature: {
            r: '0x4b6f3a4599ea88f516eb74113794135f62047c7e8854e477349ed048b2b36087',
            s: '0x0edc11df1a6efc2f9c46a16750b372ae7221f05a0c789d08d48b8d466e1ccc5c',
            v: 27,
          },
          attester: '0x2d7B3e18D45846DA09D78e3644F15BD4aafa634d',
          schema:
            '0x85e90e3e16d319578888790af3284fea8bca549305071531e7478e3e0b5e7d6d',
          data: {
            data: '0x8c52a606220805c7279aa59b43a1dd72c5d52819d303517d4c46ee92f1960dab000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000007646973636f726400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000037d7b2263697068657274657874223a22732f654b4a46416a4b6f4d7550324f6f615041303146717031644937307a766873466139696b724732426c4149314f65737173692b6a76325079383777696c4e48553035755a684e2b434a513979784347504d486945506872754659665863426737306d492b492b6b447378332b3168726f39766f38624f3339342b35384e7a347538386c576731354774556a494c513365316b397651577352717739563945325a37576150736e646743774867493d222c2264617461546f456e637279707448617368223a2238633231643365373732323362663332333038643033633439313838663133363338343032366264643664396536643837613466386238396635613465356436222c2265766d436f6e7472616374436f6e646974696f6e73223a5b7b22636f6e747261637441646472657373223a22307837383761654464394662336531364565463562303043304633356631303564614432413161413135222c2266756e6374696f6e4e616d65223a226861735065726d697373696f6e222c2266756e6374696f6e506172616d73223a5b22307839346263636561366239383435373236306162656139373938303665633930383938383138616433336530313937336162663334336432643130363632366264222c223a7573657241646472657373225d2c2266756e6374696f6e416269223a7b22696e70757473223a5b7b22696e7465726e616c54797065223a2262797465733332222c226e616d65223a22756964222c2274797065223a2262797465733332227d2c7b22696e7465726e616c54797065223a2261646472657373222c226e616d65223a226163636f756e74222c2274797065223a2261646472657373227d5d2c226e616d65223a226861735065726d697373696f6e222c226f757470757473223a5b7b22696e7465726e616c54797065223a22626f6f6c222c226e616d65223a22222c2274797065223a22626f6f6c227d5d2c2273746174654d75746162696c697479223a2276696577222c2274797065223a2266756e6374696f6e227d2c22636861696e223a227365706f6c6961222c2272657475726e56616c756554657374223a7b226b6579223a22222c22636f6d70617261746f72223a223d222c2276616c7565223a2274727565227d7d5d2c22636861696e223a227365706f6c6961222c226461746154797065223a22737472696e67227d000000',
            recipient: '0x026B727b60D336806B87d60e95B6d7FAd2443dD6',
            expirationTime: 0,
            refUID:
              '0x0000000000000000000000000000000000000000000000000000000000000000',
            revocable: true,
            value: 0,
          },
          deadline: 0,
        },
      ],
    });
    console.log(error);

    console.log('end');
  };

  const handleLinkIdentifier = async () => {
    const siweJwt = localStorage.getItem('OCI_TOKEN');
    if (!siweJwt || !provider) return;
    const anyJwt = getTokenForProvider(provider);
    mutateIdentifier({
      siweJwt,
      anyJwt,
    });
  };

  return (
    <Paper
      className="p-12"
      sx={{
        height: 'calc(100vh - 100px)',
      }}
      variant="elevation"
      elevation={0}
    >
      <StepperComponent steps={steps} activeStep={activeStep} />
      <div className="relative flex justify-center text-center mt-4 top-[12rem]">
        {activeStep === 0 && (
          <div className="flex flex-col items-center space-y-3">
            <Typography variant="h6" fontWeight="bold" color="initial">
              Let’s get started!
            </Typography>
            <Typography variant="body1" color="GrayText">
              Please sign in with {provider}.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAuthorize}
              className="mt-2"
            >
              Sign in with {provider}
            </Button>
          </div>
        )}
        {activeStep === 1 && (
          <div className="flex flex-col items-center space-y-3">
            <Typography variant="h6" fontWeight="bold" color="initial">
              Generate an attestation.
            </Typography>
            <Typography variant="body1" color="GrayText">
              An attestation is a proof that links your {provider} account to
              your wallet address.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLinkIdentifier}
              className="mt-2"
            >
              Create attestation
            </Button>
          </div>
        )}
        {activeStep === 2 && (
          <div className="flex flex-col items-center space-y-3">
            <Typography variant="h6" fontWeight="bold" color="initial">
              Sign Transaction.
            </Typography>
            <Typography variant="body1" color="GrayText">
              Signing the transaction will put your attestation on-chain.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAttest}
              className="mt-2"
            >
              Sign Transaction
            </Button>
            <Typography variant="body2" color="GrayText" className="mt-2">
              This will cost a small amount of gas.
            </Typography>
          </div>
        )}
      </div>
    </Paper>
  );
}

export default Attestation;
