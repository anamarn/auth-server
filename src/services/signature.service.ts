import { Injectable } from '@nestjs/common';
import { JSONObject } from 'src/types/json-object.type';
import { normalizeJSON } from 'src/utils/normalize-json.util';
import { SIGNATURE_ALGORITHMS_ENUM } from 'src/enums/signature-algorithms.enum';
import { VerifyDataInput as VerifySignatureInput } from 'src/types/verify-data-input.type';
import * as crypto from 'crypto';

@Injectable()
export class SignatureService {
  private secretSigningKey: string;
  private signingAlgorithm: SIGNATURE_ALGORITHMS_ENUM =
    SIGNATURE_ALGORITHMS_ENUM.HMAC_SHA_256;
  constructor() {
    if (!process.env.SIGN_SECRET) {
      throw new Error('SIGN_SECRET environment variable is not defined.');
    }
    this.secretSigningKey = process.env.SIGN_SECRET;
  }
  signJSON(json: JSONObject): { signature: string } {
    const normalizedJSONString = JSON.stringify(normalizeJSON(json));
    const hmacSignature = this.computeSignature(normalizedJSONString);
    return { signature: hmacSignature };
  }

  verifySignatureJSON(json: VerifySignatureInput): boolean {
    const normalizedJSONString = JSON.stringify(normalizeJSON(json.data));
    const hmacSignature = this.computeSignature(normalizedJSONString);
    return json.signature === hmacSignature;
  }

  private computeSignature(stringToSign: string): string {
    switch (this.signingAlgorithm) {
      case SIGNATURE_ALGORITHMS_ENUM.HMAC_SHA_256:
        return crypto
          .createHmac(
            SIGNATURE_ALGORITHMS_ENUM.HMAC_SHA_256,
            this.secretSigningKey,
          )
          .update(stringToSign)
          .digest('hex');
      default:
        throw new Error(`Unsupported signing algorithm`);
    }
  }
}
