import { Injectable } from '@nestjs/common';
import { JSONObject } from 'src/types/json-object.type';
import * as crypto from 'crypto';
import { normalizeJson } from 'src/utils/normalize-json.uitl';

@Injectable()
export class VerificationService {
  constructor() {}
  verifyJSON(json: { signature: string; data: JSONObject }): boolean {
    const normalizedJSONString = JSON.stringify(normalizeJson(json.data));
    const hmacSignature = crypto
      .createHmac('sha256', process.env.SIGN_SECRET ?? 'hola')
      .update(normalizedJSONString)
      .digest('hex');
    return json.signature === hmacSignature;
  }
}
