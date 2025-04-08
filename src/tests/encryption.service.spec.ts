import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from '../services/encryption.service';

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  describe('encryptJSON', () => {
    it('should encrypt all values in the JSON object in Base 64', () => {
      const input = { key1: 'value1', key2: 'value2', key3: 25 };
      const result = encryptionService.encryptJSON(input);

      expect(result).toHaveProperty('key1');
      expect(result).toHaveProperty('key2');
      expect(result).toHaveProperty('key3');
      expect(result.key1).toBe('dmFsdWUx');
      expect(result.key2).toBe('dmFsdWUy');
      expect(result.key3).toBe('MjU=');
    });
  });

  describe('decryptJSON', () => {
    it('should decrypt all values who are base64 encoded in the JSON object', () => {
      const encryptedInput = {
        key1: Buffer.from('value1').toString('base64'),
        key2: Buffer.from('value2').toString('base64'),
        key3: 'notEncryptedValue',
      };
      const result = encryptionService.decryptJSON(encryptedInput);

      expect(result).toHaveProperty('key1', 'value1');
      expect(result).toHaveProperty('key2', 'value2');
      expect(result).toHaveProperty('key3', 'notEncryptedValue');
    });
  });

  describe('coherence encryption decryption', () => {
    it('encrypt + decrypt should give the original object', () => {
      const input = {
        name: 'John Doe',
        age: 30,
        contact: {
          email: 'john@example.com',
          phone: '123-456-7890',
        },
      };
      const encryptedInput = encryptionService.encryptJSON(input);
      const result = encryptionService.decryptJSON(encryptedInput);
      expect(result).toEqual(input);
    });
  });

  describe('isStringEncoded', () => {
    it('should return true for a valid Base64 encoded string', () => {
      const input = Buffer.from('testString').toString('base64');
      const result = encryptionService['isStringEncoded'](input);

      expect(result).toBe(true);
    });

    it('should return false for an invalid Base64 encoded string', () => {
      const input = 'Hola Mundo';
      const result = encryptionService['isStringEncoded'](input);

      expect(result).toBe(false);
    });
  });
});
