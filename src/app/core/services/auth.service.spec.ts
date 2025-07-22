import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    tokenService = jasmine.createSpyObj('TokenService', ['clearToken']);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: TokenService, useValue: tokenService }]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call TokenService.clearToken() on logout', () => {
    service.logout();
    expect(tokenService.clearToken).toHaveBeenCalled();
  });
});
