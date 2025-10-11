export interface VerificationRequest {
  id: string;
}

export interface VerificationResult {
  valid: boolean;
  credential?: any;
  verifiedBy: string;
  verifiedAt: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}