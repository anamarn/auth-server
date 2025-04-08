import { Test, TestingModule } from '@nestjs/testing';
import { SignatureService } from '../services/signature.service';
import { SIGNATURE_ALGORITHMS_ENUM } from '../enums/signature-algorithms.enum';
import { time } from 'console';

describe('SignatureService', () => {
  let signatureService: SignatureService;

  beforeEach(async () => {
    process.env.SIGN_SECRET = 'test-secret-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [SignatureService],
    }).compile();

    signatureService = module.get<SignatureService>(SignatureService);
  });

  afterEach(() => {
    delete process.env.SIGN_SECRET;
  });

  describe('signJSON', () => {
    it('should generate a valid signature for the given JSON object', () => {
      const input = { key: 'value' };
      const result = signatureService.signJSON(input);

      expect(result).toHaveProperty('signature');
      expect(typeof result.signature).toBe('string');
    });
  });

  describe('verifySignatureJSON', () => {
    it('should return true for a valid signature', () => {
      const input = { key: 'value' };
      const signature = signatureService.signJSON(input).signature;

      const isValid = signatureService.verifySignatureJSON({
        signature,
        data: input,
      });

      expect(isValid).toBe(true);
    });

    it('should return false for an invalid signature', () => {
      const input = { key: 'value' };
      const invalidSignature = 'invalid-signature';

      const isValid = signatureService.verifySignatureJSON({
        signature: invalidSignature,
        data: input,
      });

      expect(isValid).toBe(false);
    });

    it('should return the same signature for the same JSON values', () => {
      const input1 = { message: 'Hello World', timestamp: 1616161616 };
      const input2 = { timestamp: 1616161616, message: 'Hello World' };
      const result1 = signatureService.signJSON(input1);
      const result2 = signatureService.signJSON(input2);
      expect(result1.signature).toEqual(result2.signature);
    });
  });

  describe('computeSignature', () => {
    it('should throw an error for unsupported signing algorithms', () => {
      signatureService['signingAlgorithm'] =
        'UNSUPPORTED_ALGO' as SIGNATURE_ALGORITHMS_ENUM;

      expect(() => signatureService['computeSignature']('test-string')).toThrow(
        'Unsupported signing algorithm',
      );
    });
  });

  describe('constructor', () => {
    it('should throw an error if SIGN_SECRET is not defined', () => {
      delete process.env.SIGN_SECRET;

      expect(() => new SignatureService()).toThrow(
        'SIGN_SECRET environment variable is not defined.',
      );
    });
  });
});
