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
import { DecryptionService } from './services/decryption.service';
import { VerificationService } from './services/verification.service';
import {
  JSONObject as encryptDataInputDTO,
  JSONObject,
} from './types/json-object.type';
import { SignatureService } from './services/signature.service';
@ApiTags('Encryption')
@Controller()
export class AppController {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly decryptionService: DecryptionService, // TODO: Fix this
    private readonly signatureService: SignatureService,
    private readonly verificationService: VerificationService,
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
  decryptData(@Body() data: JSONObject): Record<string, unknown> {
    return this.decryptionService.decryptJSON(data);
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
  signData(@Body() data: JSONObject): Record<string, unknown> {
    return this.signatureService.signJSON(data); // the typing!!!
  }

  @Post('verify')
  @ApiBody({
    type: Object, // create a dto
    description: 'JSON object to verify',
    required: true,
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @ApiResponse({ status: 204, description: 'Succesfull verification' })
  @ApiResponse({ status: 400, description: 'Failed verification' })
  @HttpCode(204)
  verifyData(@Body() data: { signature: string; data: JSONObject }): {
    success: boolean;
  } {
    const inputIsVerified = this.verificationService.verifyJSON(data);
    if (!inputIsVerified) {
      throw new HttpException({ success: false }, HttpStatus.BAD_REQUEST);
    }

    return { success: true };
  }
}
