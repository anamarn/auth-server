import { Injectable } from '@nestjs/common';
import { JSONObject } from 'src/types/json-object.type';

@Injectable()
export class EncryptionService {
  encryptJSON(json: JSONObject): Record<string, string> {
    const encryptedJSON = Object.fromEntries(
      Object.entries(json).map(([key, value]) => {
        const stringValue =
          typeof value === 'string' ? value : JSON.stringify(value);
        return [key, this.encryptString(stringValue)];
      }),
    );
    return encryptedJSON;
  }
  private encryptString(string: string): string {
    return Buffer.from(string).toString('base64');
  }
}
