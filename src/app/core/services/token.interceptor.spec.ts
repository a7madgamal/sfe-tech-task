import { HttpHandlerFn, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';
import { TokenService } from './token.service';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('tokenInterceptor (function-based)', () => {
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: jasmine.createSpyObj('TokenService', ['getToken', 'clearToken']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    });
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  function runInterceptor(req: HttpRequest<any>, nextFn: HttpHandlerFn) {
    // tokenInterceptor uses inject(TokenService) internally, so TestBed context is required
    let result: HttpEvent<any> | undefined;
    let error: any;
    TestBed.runInInjectionContext(() => {
      tokenInterceptor(req, nextFn).subscribe({
        next: event => (result = event),
        error: err => (error = err)
      });
    });
    return { result, error };
  }

  it('should add Authorization header if token exists', () => {
    tokenService.getToken.and.returnValue('abc123');
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = r => of(new HttpResponse({ status: 200, body: r }));
    const { result } = runInterceptor(req, next);
    expect(result).toBeDefined();
    if (result instanceof HttpResponse) {
      expect(result.body.headers.get('Authorization')).toBe('Bearer abc123');
    } else {
      fail('Result is not an HttpResponse');
    }
  });

  it('should not add Authorization header if token is missing', () => {
    tokenService.getToken.and.returnValue(null);
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = r => of(new HttpResponse({ status: 200, body: r }));
    const { result } = runInterceptor(req, next);
    expect(result).toBeDefined();
    if (result instanceof HttpResponse) {
      expect(result.body.headers.has('Authorization')).toBe(false);
    } else {
      fail('Result is not an HttpResponse');
    }
  });

  it('should not interfere with unrelated requests', () => {
    tokenService.getToken.and.returnValue(null);
    const req = new HttpRequest('POST', '/api/other', { foo: 'bar' });
    const next: HttpHandlerFn = r => of(new HttpResponse({ status: 200, body: r }));
    const { result } = runInterceptor(req, next);
    expect(result).toBeDefined();
    if (result instanceof HttpResponse) {
      expect(result.body.method).toBe('POST');
      expect(result.body.body).toEqual({ foo: 'bar' });
    } else {
      fail('Result is not an HttpResponse');
    }
  });

  it('should clear token and redirect to /auth on 401 error', () => {
    tokenService.getToken.and.returnValue('abc123');
    const req = new HttpRequest('GET', '/api/protected');
    const errorResponse = { status: 401, message: 'Unauthorized' };
    const next: HttpHandlerFn = () => throwError(() => errorResponse);
    const { error } = runInterceptor(req, next);
    expect(tokenService.clearToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    expect(error).toBe(errorResponse);
  });
});
