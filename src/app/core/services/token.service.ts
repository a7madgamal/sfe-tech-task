import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  setUser(user: { id: number; username: string; role: string }): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): { id: number; username: string; role: string } | null {
    const userJson = sessionStorage.getItem(this.USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  /**
   * Decodes the JWT and returns the current user object (id, username, role) if present and valid.
   * Returns null if token is missing, malformed, or user info is not present/valid.
   */
  getCurrentUser(): { id: number; username: string; role: string } | null {
    return this.getUser();
  }
}
