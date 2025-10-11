import axios from 'axios';
import db from './database';
import { VerificationResult } from './types';
import { nanoid } from 'nanoid';

const WORKER_ID = process.env.WORKER_ID || `worker-${nanoid(6)}`;
const ISSUANCE_SERVICE_URL = process.env.ISSUANCE_SERVICE_URL || 'http://localhost:3001';

export class VerificationService {
  static getWorkerId(): string {
    return WORKER_ID;
  }

  static async verifyCredential(credentialId: string): Promise<VerificationResult> {
    const verifiedAt = new Date().toISOString();

    try {
      // Call issuance service to check if credential exists
      const response = await axios.get(
        `${ISSUANCE_SERVICE_URL}/api/credentials/${credentialId}`,
        { timeout: 5000 }
      );

      if (response.data.success && response.data.data) {
        const credential = response.data.data;

        // Log verification
        this.logVerification(credentialId, true);

        return {
          valid: true,
          credential,
          verifiedBy: WORKER_ID,
          verifiedAt,
          message: `Credential verified by ${WORKER_ID}`,
        };
      }

      // Log failed verification
      this.logVerification(credentialId, false);

      return {
        valid: false,
        verifiedBy: WORKER_ID,
        verifiedAt,
        message: 'Credential not found',
      };
    } catch (error: any) {
      // Log failed verification
      this.logVerification(credentialId, false);

      if (error.response?.status === 404) {
        return {
          valid: false,
          verifiedBy: WORKER_ID,
          verifiedAt,
          message: 'Credential not found',
        };
      }

      throw new Error(`Verification failed: ${error.message}`);
    }
  }

  private static logVerification(credentialId: string, isValid: boolean): void {
    const stmt = db.prepare(`
      INSERT INTO verification_logs (credential_id, verified_by, verified_at, is_valid)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(credentialId, WORKER_ID, new Date().toISOString(), isValid ? 1 : 0);
  }

  static getVerificationLogs(credentialId?: string): any[] {
    if (credentialId) {
      return db
        .prepare('SELECT * FROM verification_logs WHERE credential_id = ? ORDER BY created_at DESC')
        .all(credentialId);
    }

    return db
      .prepare('SELECT * FROM verification_logs ORDER BY created_at DESC LIMIT 100')
      .all();
  }
}