/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DelegatedAttestationRequest,
  DelegatedRevocationRequest,
  EAS,
} from '@ethereum-attestation-service/eas-sdk';
import { JsonRpcSigner } from 'ethers';
import { Address } from 'viem';

import { AttestPayload, RevokePayload } from '../interfaces';

class EASService {
  private eas: EAS | null = null;

  constructor(
    contractAddress: Address,
    private signer: JsonRpcSigner | undefined
  ) {
    this.initializeEAS(contractAddress);
    this.connect();
  }

  /**
   * Initializes the EAS instance with the provided contract address.
   * @param contractAddress The contract address to use for EAS.
   */
  private initializeEAS(contractAddress: Address): void {
    this.eas = new EAS(contractAddress);
  }

  /**
   * Connects the EAS instance to the provided signer.
   */
  private connect(): void {
    if (!this.eas) {
      throw new Error('EAS instance is not initialized');
    }
    if (!this.signer) {
      throw new Error('Signer is not provided');
    }
    this.eas.connect(this.signer);
  }

  /**
   * Converts string representations of numbers in a payload to BigInts.
   * @param obj The object containing strings to convert.
   */
  private convertStringsToBigInts = (obj: unknown): unknown => {
    if (typeof obj === 'string' && /^[0-9]+$/.test(obj)) {
      return BigInt(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(this.convertStringsToBigInts);
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k,
          this.convertStringsToBigInts(v),
        ])
      );
    }
    return obj;
  };

  /**
   * Static method to prepare the revocation request from a payload.
   * @param payload The payload containing the revocation details.
   */
  private static prepareRevocationRequest(
    payload: RevokePayload
  ): DelegatedRevocationRequest {
    if (!('revoker' in payload.message)) {
      throw new Error('Invalid payload: Missing revoker field.');
    }

    return {
      schema: payload.message.schema,
      data: {
        uid: payload.message.uid,
      },
      signature: payload.signature,
      revoker: payload.message.revoker,
      deadline: 0n,
    };
  }

  /**
   * Static method to prepare the attestation request from a payload.
   * @param payload The payload containing the attestation details.
   */
  private static prepareAttestationRequest(
    payload: AttestPayload
  ): DelegatedAttestationRequest {
    return {
      schema: payload.message.schema,
      data: {
        recipient: payload.message.recipient,
        expirationTime: payload.message.expirationTime,
        revocable: payload.message.revocable,
        refUID: payload.message.refUID,
        data: payload.message.data,
      },
      signature: payload.signature,
      attester: payload.message.attester as string,
      deadline: 0n,
    };
  }

  /**
   * Revokes an attestation by delegation.
   * @param payload The payload containing the revocation details.
   */
  public async revokeByDelegation(payload: RevokePayload): Promise<void> {
    if (!this.eas) {
      throw new Error('EAS is not initialized');
    }

    const convertedPayload = this.convertStringsToBigInts(
      payload
    ) as RevokePayload;
    const revocationRequest =
      EASService.prepareRevocationRequest(convertedPayload);

    try {
      const tx = await this.eas.revokeByDelegation(revocationRequest);
      await tx.wait();
      console.log('Revocation successful:', tx);
    } catch (error: any) {
      console.error('Revocation failed:', error);
      throw new Error(`Revocation failed: ${error.message}`);
    }
  }

  /**
   * Attests by delegation.
   * @param attestationPayload The payload containing the attestation details.
   */
  public async attestByDelegation(
    attestationPayload: AttestPayload
  ): Promise<void> {
    console.log('attestationPayload', attestationPayload);

    if (!this.eas) {
      throw new Error('EAS is not initialized');
    }

    const convertedPayload = this.convertStringsToBigInts(
      attestationPayload
    ) as AttestPayload;
    const attestationRequest =
      EASService.prepareAttestationRequest(convertedPayload);

    console.log('attestationRequest', attestationRequest);
    try {
      const tx = await this.eas.attestByDelegation(attestationRequest);
      await tx.wait();
      console.log('Attestation successful:', tx);
    } catch (error: any) {
      console.error('Attestation failed:', error);
      throw new Error(`Attestation failed: ${error.message}`);
    }
  }

  /**
   * Returns the connected EAS instance for further operations.
   */
  public getEASInstance(): EAS {
    if (!this.eas) {
      throw new Error('EAS instance is not initialized');
    }
    return this.eas;
  }
}

export default EASService;
