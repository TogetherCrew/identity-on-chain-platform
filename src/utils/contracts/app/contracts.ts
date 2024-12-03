export const appContracts = [
  {
    chainId: 11155420,
    address: '0xb250C2b5967FEc8241FD9a26C30145Fbdf347eEC',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'initialAuthority',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [
          { internalType: 'address', name: 'authority', type: 'address' },
        ],
        name: 'AccessManagedInvalidAuthority',
        type: 'error',
      },
      {
        inputs: [
          { internalType: 'address', name: 'caller', type: 'address' },
          { internalType: 'uint32', name: 'delay', type: 'uint32' },
        ],
        name: 'AccessManagedRequiredDelay',
        type: 'error',
      },
      {
        inputs: [{ internalType: 'address', name: 'caller', type: 'address' }],
        name: 'AccessManagedUnauthorized',
        type: 'error',
      },
      { inputs: [], name: 'ReentrancyGuardReentrantCall', type: 'error' },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationCreated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationDeleted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationUpdated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'authority',
            type: 'address',
          },
        ],
        name: 'AuthorityUpdated',
        type: 'event',
      },
      {
        inputs: [],
        name: 'authority',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.ApplicationDto',
            name: 'dto',
            type: 'tuple',
          },
        ],
        name: 'createApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
        name: 'deleteApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
        name: 'getApplication',
        outputs: [
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.Application',
            name: '',
            type: 'tuple',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'start', type: 'uint256' },
          { internalType: 'uint256', name: 'limit', type: 'uint256' },
        ],
        name: 'getApplications',
        outputs: [
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.Application[]',
            name: '',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getNextApplicationId',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'isConsumingScheduledOp',
        outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'newAuthority', type: 'address' },
        ],
        name: 'setAuthority',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          {
            components: [
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.ApplicationDto',
            name: 'dto',
            type: 'tuple',
          },
        ],
        name: 'updateApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
  {
    chainId: 84532,
    address: '0x52d0a71B42Dd84532A7B332fdfa059E8a7391092',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'initialAuthority',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [
          { internalType: 'address', name: 'authority', type: 'address' },
        ],
        name: 'AccessManagedInvalidAuthority',
        type: 'error',
      },
      {
        inputs: [
          { internalType: 'address', name: 'caller', type: 'address' },
          { internalType: 'uint32', name: 'delay', type: 'uint32' },
        ],
        name: 'AccessManagedRequiredDelay',
        type: 'error',
      },
      {
        inputs: [{ internalType: 'address', name: 'caller', type: 'address' }],
        name: 'AccessManagedUnauthorized',
        type: 'error',
      },
      { inputs: [], name: 'ReentrancyGuardReentrantCall', type: 'error' },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationCreated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationDeleted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationUpdated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'authority',
            type: 'address',
          },
        ],
        name: 'AuthorityUpdated',
        type: 'event',
      },
      {
        inputs: [],
        name: 'authority',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.ApplicationDto',
            name: 'dto',
            type: 'tuple',
          },
        ],
        name: 'createApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
        name: 'deleteApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
        name: 'getApplication',
        outputs: [
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.Application',
            name: '',
            type: 'tuple',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'start', type: 'uint256' },
          { internalType: 'uint256', name: 'limit', type: 'uint256' },
        ],
        name: 'getApplications',
        outputs: [
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.Application[]',
            name: '',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getNextApplicationId',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'isConsumingScheduledOp',
        outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'newAuthority', type: 'address' },
        ],
        name: 'setAuthority',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          {
            components: [
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.ApplicationDto',
            name: 'dto',
            type: 'tuple',
          },
        ],
        name: 'updateApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
  {
    chainId: 42_161,
    address: '0x8006cCF2b3240bB716c86E5a16A9dD9b32eC5c53',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'initialAuthority',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [
          { internalType: 'address', name: 'authority', type: 'address' },
        ],
        name: 'AccessManagedInvalidAuthority',
        type: 'error',
      },
      {
        inputs: [
          { internalType: 'address', name: 'caller', type: 'address' },
          { internalType: 'uint32', name: 'delay', type: 'uint32' },
        ],
        name: 'AccessManagedRequiredDelay',
        type: 'error',
      },
      {
        inputs: [{ internalType: 'address', name: 'caller', type: 'address' }],
        name: 'AccessManagedUnauthorized',
        type: 'error',
      },
      { inputs: [], name: 'ReentrancyGuardReentrantCall', type: 'error' },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationCreated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationDeleted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            indexed: false,
            internalType: 'struct IApplicationManager.Application',
            name: 'application',
            type: 'tuple',
          },
        ],
        name: 'ApplicationUpdated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'authority',
            type: 'address',
          },
        ],
        name: 'AuthorityUpdated',
        type: 'event',
      },
      {
        inputs: [],
        name: 'authority',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            components: [
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.ApplicationDto',
            name: 'dto',
            type: 'tuple',
          },
        ],
        name: 'createApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
        name: 'deleteApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
        name: 'getApplication',
        outputs: [
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.Application',
            name: '',
            type: 'tuple',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'start', type: 'uint256' },
          { internalType: 'uint256', name: 'limit', type: 'uint256' },
        ],
        name: 'getApplications',
        outputs: [
          {
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.Application[]',
            name: '',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getNextApplicationId',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'isConsumingScheduledOp',
        outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'newAuthority', type: 'address' },
        ],
        name: 'setAuthority',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          {
            components: [
              { internalType: 'string', name: 'name', type: 'string' },
              { internalType: 'address', name: 'account', type: 'address' },
            ],
            internalType: 'struct IApplicationManager.ApplicationDto',
            name: 'dto',
            type: 'tuple',
          },
        ],
        name: 'updateApplication',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
];
