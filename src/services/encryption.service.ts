import { Injectable } from '@nestjs/common';
import { JSONObject } from 'src/types/json-object.type';
import { ENCRYPTION_ALGORITHMS_ENUM } from 'src/enums/encryption-algorithms.enum';
import { tryParseJSON } from 'src/utils/try-parse-json.util';
@Injectable()
export class EncryptionService {
  private encryptionAlgorithm: ENCRYPTION_ALGORITHMS_ENUM =
    ENCRYPTION_ALGORITHMS_ENUM.BASE_64;
  constructor() {}

  encryptJSON = (decryptedJSON: JSONObject): Record<string, string> => {
    const encryptedJSON = Object.fromEntries(
      Object.entries(decryptedJSON).map(([key, value]) => {
        const stringValue =
          typeof value === 'string' ? value : JSON.stringify(value);
        return [key, this.encryptString(stringValue)];
      }),
    );
    return encryptedJSON;
  };

  decryptJSON = (encryptedJSON: JSONObject) => {
    const decryptedJSON = Object.fromEntries(
      Object.entries(encryptedJSON).map(([key, value]) => {
        if (typeof value === 'string' && this.isStringEncoded(value)) {
          const decryptedString = this.decryptString(value);
          const parsedValue = tryParseJSON(decryptedString);
          return [key, parsedValue];
        }
        return [key, value];
      }),
    );
    return decryptedJSON;
  };

  private decryptString = (encryptedString: string): string => {
    switch (this.encryptionAlgorithm) {
      case ENCRYPTION_ALGORITHMS_ENUM.BASE_64:
        return Buffer.from(
          encryptedString,
          ENCRYPTION_ALGORITHMS_ENUM.BASE_64,
        ).toString('utf-8');
      default:
        throw new Error(`Unsupported encryption algorithm`);
    }
  };

  private encryptString = (decryptedString: string): string => {
    switch (this.encryptionAlgorithm) {
      case ENCRYPTION_ALGORITHMS_ENUM.BASE_64:
        return Buffer.from(decryptedString).toString(
          ENCRYPTION_ALGORITHMS_ENUM.BASE_64,
        );
      default:
        throw new Error(`Unsupported encryption algorithm`);
    }
  };

  private isStringEncoded = (encodedString: string): boolean => {
    switch (this.encryptionAlgorithm) {
      case ENCRYPTION_ALGORITHMS_ENUM.BASE_64: {
        const base64Regex =
          /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
        return base64Regex.test(encodedString);
      }
      default:
        throw new Error(`Unsupported encryption algorithm`);
    }
  };
}
