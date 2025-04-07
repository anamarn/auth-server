import { Injectable } from '@nestjs/common';
import { JSONObject } from 'src/types/json-object.type';
import * as crypto from 'crypto';
import { normalizeJson } from 'src/utils/normalize-json.uitl';

@Injectable()
export class SignatureService {
  constructor() {}
  signJSON(json: JSONObject): { signature: string } {
    const normalizedJSONString = JSON.stringify(normalizeJson(json));
    const hmacSignature = crypto
      .createHmac('sha256', process.env.SIGN_SECRET ?? 'hola') // create arror handling
      .update(normalizedJSONString)
      .digest('hex');
    return { signature: hmacSignature };
  }
}
