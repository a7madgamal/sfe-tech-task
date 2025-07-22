import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../shared/models/auth';
import { TokenService } from './token.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly tokenService: TokenService = inject(TokenService);

  private readonly apiUrl: string = 'api/auth';

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.user);
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
  }
}
