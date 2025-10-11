export interface Credential {
  id: string;
  holderName: string;
  holderEmail: string;
  credentialType: string;
  issueDate: string;
  expiryDate?: string;
  metadata?: Record<string, any>;
}

export interface IssuedCredential extends Credential {
  issuedBy: string;
  issuedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}