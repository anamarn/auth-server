import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { EncryptionService } from './services/encryption.service';
import { DecryptionService } from './services/decryption.service';
import { SignatureService } from './services/signature.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [EncryptionService, DecryptionService, SignatureService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    // it('should return "Hello World!"', () => {
    //   expect(appController.getHello()).toBe('Hello World!');
    // });
  });
});
