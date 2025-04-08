import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EncryptionService } from './services/encryption.service';
import {
  JSONObject as encryptDataInputDTO,
  JSONObject,
} from './types/json-object.type';
import { SignatureService } from './services/signature.service';
import { VerifyDataInput } from './types/verify-data-input.type';

@ApiTags('Encryption')
@Controller()
export class AppController {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly signatureService: SignatureService,
  ) {}

  @Post('encrypt')
  @ApiBody({
    type: Object,
    description: 'JSON object to encrypt',
    required: true,
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  encryptData(@Body() data: encryptDataInputDTO): Record<string, string> {
    return this.encryptionService.encryptJSON(data);
  }

  @Post('decrypt')
  @ApiBody({
    type: Object,
    description: 'JSON object to decrypt',
    required: true,
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  decryptData(@Body() data: JSONObject) {
    return this.encryptionService.decryptJSON(data);
  }

  @Post('sign')
  @ApiBody({
    type: Object,
    description: 'JSON object to sign',
    required: true,
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  signData(@Body() data: JSONObject) {
    return this.signatureService.signJSON(data);
  }

  @Post('verify')
  @ApiBody({
    type: Object,
    description: 'JSON object to verify',
    required: true,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'JSON object to verify',
          additionalProperties: true,
        },
        signature: {
          type: 'string',
          description: 'Signature of the JSON object',
        },
      },
      required: ['data', 'signature'],
      additionalProperties: false,
    },
  })
  @ApiResponse({ status: 204, description: 'Succesfull verification' })
  @ApiResponse({ status: 400, description: 'Failed verification' })
  @HttpCode(204)
  verifyData(@Body() data: VerifyDataInput): {
    success: boolean;
  } {
    const inputIsVerified = this.signatureService.verifySignatureJSON(data);
    if (!inputIsVerified) {
      throw new HttpException({ success: false }, HttpStatus.BAD_REQUEST);
    }

    return { success: true };
  }
}
