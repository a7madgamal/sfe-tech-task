import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSignal = signal<{ id: number; username: string; role: string } | null>(this.getUser());

  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  setUser(user: { id: number; username: string; role: string }): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
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
    this.currentUserSignal.set(null);
  }

  getCurrentUser(): { id: number; username: string; role: string } | null {
    return this.currentUserSignal();
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  currentUser = this.currentUserSignal.asReadonly();
}
