import axios from 'axios';

interface ImportMetaEnv {
  VITE_ISSUANCE_API_URL?: string;
  VITE_VERIFICATION_API_URL?: string;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

const ISSUANCE_API_URL = import.meta.env.VITE_ISSUANCE_API_URL || 'http://localhost:3001/api';
const VERIFICATION_API_URL = import.meta.env.VITE_VERIFICATION_API_URL || 'http://localhost:3002/api';

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

export const issuanceApi = {
  async issueCredential(credential: Credential): Promise<ApiResponse<IssuedCredential>> {
    const response = await axios.post(`${ISSUANCE_API_URL}/issue`, credential);
    return response.data;
  },

  async getCredential(id: string): Promise<ApiResponse<IssuedCredential>> {
    const response = await axios.get(`${ISSUANCE_API_URL}/credentials/${id}`);
    return response.data;
  },

  async getAllCredentials(): Promise<ApiResponse<IssuedCredential[]>> {
    const response = await axios.get(`${ISSUANCE_API_URL}/credentials`);
    return response.data;
  },

  async healthCheck(): Promise<ApiResponse> {
    const response = await axios.get(`${ISSUANCE_API_URL}/health`);
    return response.data;
  },
};

export const verificationApi = {
  async verifyCredential(id: string): Promise<ApiResponse> {
    const response = await axios.post(`${VERIFICATION_API_URL}/verify`, { id });
    return response.data;
  },

  async getLogs(credentialId?: string): Promise<ApiResponse> {
    const url = credentialId
      ? `${VERIFICATION_API_URL}/logs?credentialId=${credentialId}`
      : `${VERIFICATION_API_URL}/logs`;
    const response = await axios.get(url);
    return response.data;
  },

  async healthCheck(): Promise<ApiResponse> {
    const response = await axios.get(`${VERIFICATION_API_URL}/health`);
    return response.data;
  },
};