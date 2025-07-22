import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { TokenService } from './token.service';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';

// Dummy routes for testing
const routes: Routes = [
  { path: 'auth', component: class DummyComponent {} },
  { path: 'users', component: class DummyComponent {} }
];

describe('authGuard (functional)', () => {
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    tokenService = jasmine.createSpyObj('TokenService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [{ provide: TokenService, useValue: tokenService }, provideRouter(routes)]
    });
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should allow navigation if token exists', () => {
    tokenService.getToken.and.returnValue('abc123');
    const result = authGuard();
    expect(result).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should deny navigation and redirect to /auth if token is missing', () => {
    tokenService.getToken.and.returnValue(null);
    const result = authGuard();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth']);
  });
});
