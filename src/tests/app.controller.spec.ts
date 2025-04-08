import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { EncryptionService } from '../services/encryption.service';
import { SignatureService } from '../services/signature.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let encryptionService: EncryptionService;
  let signatureService: SignatureService;

  beforeEach(async () => {
    const mockEncryptionService = {
      encryptJSON: jest.fn(() => {}),
      decryptJSON: jest.fn(() => {}),
    } as const;

    const mockSignatureService = {
      signJSON: jest.fn(() => {}),
      verifySignatureJSON: jest.fn(() => {}),
    } as const;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: EncryptionService, useValue: mockEncryptionService },
        { provide: SignatureService, useValue: mockSignatureService },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    encryptionService = module.get<EncryptionService>(EncryptionService);
    signatureService = module.get<SignatureService>(SignatureService);
  });

  describe('encryptData', () => {
    it('should call EncryptionService.encryptJSON and return the result', () => {
      const input = { key: 'value' };
      const encryptedResult = { key: 'encryptedValue' };
      jest
        .spyOn(encryptionService, 'encryptJSON')
        .mockReturnValue(encryptedResult);

      const result = appController.encryptData(input);

      expect(encryptionService.encryptJSON).toHaveBeenCalledWith(input);
      expect(result).toEqual(encryptedResult);
    });
  });

  describe('decryptData', () => {
    it('should call EncryptionService.decryptJSON and return the result', () => {
      const input = { key: 'encryptedValue' };
      const decryptedResult = { key: 'value' };
      jest
        .spyOn(encryptionService, 'decryptJSON')
        .mockReturnValue(decryptedResult);

      const result = appController.decryptData(input);

      expect(encryptionService.decryptJSON).toHaveBeenCalledWith(input);
      expect(result).toEqual(decryptedResult);
    });
  });

  describe('signData', () => {
    it('should call SignatureService.signJSON and return the signature', () => {
      const input = { key: 'value' };
      const signatureResult = { signature: 'mockSignature' };
      jest.spyOn(signatureService, 'signJSON').mockReturnValue(signatureResult);

      const result = appController.signData(input);

      expect(signatureService.signJSON).toHaveBeenCalledWith(input);
      expect(result).toEqual(signatureResult);
    });
  });

  describe('verifyData', () => {
    it('should return success if the signature is valid', () => {
      const input = { signature: 'mockSignature', data: { key: 'value' } };
      jest.spyOn(signatureService, 'verifySignatureJSON').mockReturnValue(true);

      const result = appController.verifyData(input);

      expect(signatureService.verifySignatureJSON).toHaveBeenCalledWith(input);
      expect(result).toEqual({ success: true });
    });

    it('should throw an HttpException if the signature is invalid', () => {
      const input = { signature: 'invalidSignature', data: { key: 'value' } };
      jest
        .spyOn(signatureService, 'verifySignatureJSON')
        .mockReturnValue(false);

      expect(() => appController.verifyData(input)).toThrow(
        new HttpException({ success: false }, HttpStatus.BAD_REQUEST),
      );
    });
  });
});
