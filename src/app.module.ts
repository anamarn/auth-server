import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EncryptionService } from './services/encryption.service';
import { DecryptionService } from './services/decryption.service';

import { SignatureService } from './services/signature.service';
import { VerificationService } from './services/verification.service';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    EncryptionService,
    DecryptionService,
    SignatureService,
    VerificationService,
  ],
})
export class AppModule {}
