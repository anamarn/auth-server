import { Injectable } from '@nestjs/common';
import { JSONObject } from 'src/types/json-object.type';
import { isStringBase64Encoded } from 'src/utils/is-string-base-64-encoded.util';
@Injectable()
export class DecryptionService {
  decryptJSON(encryptedJSON: JSONObject): JSONObject {
    const decryptedJSON = Object.fromEntries(
      Object.entries(encryptedJSON).map(([key, value]) => {
        if (typeof value === 'string' && isStringBase64Encoded(value)) {
          const decryptedString = this.decryptString(value);
          const parsedValue = this.tryParseJSON(decryptedString) as JSONObject; // code smells fix
          return [key, parsedValue];
        }
        return [key, value];
      }),
    );
    return decryptedJSON;
  }
  private decryptString(encryptedString: string): string {
    return Buffer.from(encryptedString, 'base64').toString('utf-8');
  }
  private tryParseJSON(value: string): unknown {
    //try better fix
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}
