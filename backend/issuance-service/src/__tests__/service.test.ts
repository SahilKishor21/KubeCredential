import { IssuanceService } from '../service';
import { Credential } from '../types';

describe('IssuanceService', () => {
  const mockCredential: Credential = {
    id: 'test-123',
    holderName: 'John Doe',
    holderEmail: 'john@example.com',
    credentialType: 'Certificate',
    issueDate: new Date().toISOString(),
  };

  beforeEach(() => {
    // Clean up test data
    // In a real scenario, you'd use a test database
  });

  test('should return worker ID', () => {
    const workerId = IssuanceService.getWorkerId();
    expect(workerId).toBeDefined();
    expect(typeof workerId).toBe('string');
  });

  test('should issue a new credential', () => {
    const issued = IssuanceService.issueCredential(mockCredential);
    expect(issued.id).toBe(mockCredential.id);
    expect(issued.issuedBy).toBeDefined();
    expect(issued.issuedAt).toBeDefined();
  });

  test('should throw error for duplicate credential', () => {
    IssuanceService.issueCredential(mockCredential);
    expect(() => {
      IssuanceService.issueCredential(mockCredential);
    }).toThrow('Credential already issued');
  });

  test('should retrieve credential by ID', () => {
    IssuanceService.issueCredential(mockCredential);
    const retrieved = IssuanceService.getCredential(mockCredential.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(mockCredential.id);
  });

  test('should return null for non-existent credential', () => {
    const retrieved = IssuanceService.getCredential('non-existent');
    expect(retrieved).toBeNull();
  });
});