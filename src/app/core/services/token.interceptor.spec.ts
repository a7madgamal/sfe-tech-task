import { HttpHandlerFn, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';
import { TokenService } from './token.service';
import { TestBed } from '@angular/core/testing';
import { inject } from '@angular/core';
import { of } from 'rxjs';

describe('tokenInterceptor (function-based)', () => {
  let tokenService: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TokenService, useValue: jasmine.createSpyObj('TokenService', ['getToken']) }]
    });
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });

  function runInterceptor(req: HttpRequest<any>, nextFn: HttpHandlerFn) {
    // tokenInterceptor uses inject(TokenService) internally, so TestBed context is required
    let result: HttpEvent<any> | undefined;
    TestBed.runInInjectionContext(() => {
      tokenInterceptor(req, nextFn).subscribe(event => (result = event));
    });
    return result;
  }

  it('should add Authorization header if token exists', () => {
    tokenService.getToken.and.returnValue('abc123');
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = r => of(new HttpResponse({ status: 200, body: r }));
    const event = runInterceptor(req, next) as HttpResponse<any>;
    expect(event.body.headers.get('Authorization')).toBe('Bearer abc123');
  });

  it('should not add Authorization header if token is missing', () => {
    tokenService.getToken.and.returnValue(null);
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = r => of(new HttpResponse({ status: 200, body: r }));
    const event = runInterceptor(req, next) as HttpResponse<any>;
    expect(event.body.headers.has('Authorization')).toBe(false);
  });

  it('should not interfere with unrelated requests', () => {
    tokenService.getToken.and.returnValue(null);
    const req = new HttpRequest('POST', '/api/other', { foo: 'bar' });
    const next: HttpHandlerFn = r => of(new HttpResponse({ status: 200, body: r }));
    const event = runInterceptor(req, next) as HttpResponse<any>;
    expect(event.body.method).toBe('POST');
    expect(event.body.body).toEqual({ foo: 'bar' });
  });
});
