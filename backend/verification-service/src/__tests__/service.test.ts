import { VerificationService } from '../service';

describe('VerificationService', () => {
  test('should return worker ID', () => {
    const workerId = VerificationService.getWorkerId();
    expect(workerId).toBeDefined();
    expect(typeof workerId).toBe('string');
  });

  test('should verify non-existent credential as invalid', async () => {
    const result = await VerificationService.verifyCredential('non-existent-123');
    expect(result.valid).toBe(false);
    expect(result.verifiedBy).toBeDefined();
    expect(result.verifiedAt).toBeDefined();
  });
});