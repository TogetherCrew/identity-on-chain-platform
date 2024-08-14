declare module '../../../contracts/chains/constants' {
  export const SUPPORTED_CHAINS: {
    chainId: number;
    easContractAbi: unknown[];
    easContractAddress: string;
  }[];
}
