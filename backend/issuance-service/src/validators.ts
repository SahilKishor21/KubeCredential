import { z } from 'zod';

export const credentialSchema = z.object({
  id: z.string().min(1, 'Credential ID is required'),
  holderName: z.string().min(1, 'Holder name is required'),
  holderEmail: z.string().email('Valid email is required'),
  credentialType: z.string().min(1, 'Credential type is required'),
  issueDate: z.string().datetime('Valid ISO date required'),
  expiryDate: z.string().datetime('Valid ISO date required').optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CredentialInput = z.infer<typeof credentialSchema>;