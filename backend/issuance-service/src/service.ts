import db from './database';
import { Credential, IssuedCredential } from './types';
import { nanoid } from 'nanoid';

const WORKER_ID = process.env.WORKER_ID || `worker-${nanoid(6)}`;

export class IssuanceService {
  static getWorkerId(): string {
    return WORKER_ID;
  }

  static issueCredential(credential: Credential): IssuedCredential {
    // Check if credential already exists
    const existing = db
      .prepare('SELECT * FROM credentials WHERE id = ?')
      .get(credential.id);

    if (existing) {
      throw new Error('Credential already issued');
    }

    const issuedCredential: IssuedCredential = {
      ...credential,
      issuedBy: WORKER_ID,
      issuedAt: new Date().toISOString(),
    };

    // Insert credential
    const stmt = db.prepare(`
      INSERT INTO credentials (
        id, holder_name, holder_email, credential_type,
        issue_date, expiry_date, metadata, issued_by, issued_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      issuedCredential.id,
      issuedCredential.holderName,
      issuedCredential.holderEmail,
      issuedCredential.credentialType,
      issuedCredential.issueDate,
      issuedCredential.expiryDate || null,
      issuedCredential.metadata ? JSON.stringify(issuedCredential.metadata) : null,
      issuedCredential.issuedBy,
      issuedCredential.issuedAt
    );

    return issuedCredential;
  }

  static getCredential(id: string): IssuedCredential | null {
    const row: any = db
      .prepare('SELECT * FROM credentials WHERE id = ?')
      .get(id);

    if (!row) return null;

    return {
      id: row.id,
      holderName: row.holder_name,
      holderEmail: row.holder_email,
      credentialType: row.credential_type,
      issueDate: row.issue_date,
      expiryDate: row.expiry_date,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      issuedBy: row.issued_by,
      issuedAt: row.issued_at,
    };
  }

  static getAllCredentials(): IssuedCredential[] {
    const rows: any[] = db.prepare('SELECT * FROM credentials ORDER BY created_at DESC').all();

    return rows.map(row => ({
      id: row.id,
      holderName: row.holder_name,
      holderEmail: row.holder_email,
      credentialType: row.credential_type,
      issueDate: row.issue_date,
      expiryDate: row.expiry_date,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      issuedBy: row.issued_by,
      issuedAt: row.issued_at,
    }));
  }
}