/**
 * AUTH TYPES
 * 
 * Tipos relacionados à autenticação.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

