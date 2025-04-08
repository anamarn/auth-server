import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EncryptionService } from './services/encryption.service';

import { SignatureService } from './services/signature.service';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [EncryptionService, SignatureService],
})
export class AppModule {}
