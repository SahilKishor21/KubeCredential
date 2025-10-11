import { create } from 'zustand';
import { IssuedCredential } from '@/lib/api';

interface CredentialState {
  credentials: IssuedCredential[];
  setCredentials: (credentials: IssuedCredential[]) => void;
  addCredential: (credential: IssuedCredential) => void;
  clearCredentials: () => void;
}

export const useCredentialStore = create<CredentialState>((set) => ({
  credentials: [],
  setCredentials: (credentials) => set({ credentials }),
  addCredential: (credential) =>
    set((state) => ({
      credentials: [credential, ...state.credentials],
    })),
  clearCredentials: () => set({ credentials: [] }),
}));