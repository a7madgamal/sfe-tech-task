import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UsersService);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to /api/users/create when addUser is called', () => {
    const user = { username: 'alice', role: 'admin', password: 'pass' };
    service.addUser(user).subscribe();
    const req = httpMock.expectOne('api/users/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush({ ...user, id: 1 });
    httpMock.verify();
  });
});
