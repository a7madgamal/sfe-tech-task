import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET users from /api/users when getUsers is called', () => {
    const mockUsers = [
      { id: 1, username: 'alice', role: 'admin' },
      { id: 2, username: 'bob', role: 'user' }
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should GET user by ID from /api/users/:id when getUserById is called', () => {
    const mockUser = { id: 1, username: 'alice', role: 'admin' };

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should POST to /api/users/create when addUser is called', () => {
    const user = { username: 'alice', role: 'admin', password: 'pass' };
    const expectedResponse = { ...user, id: 1 };

    service.addUser(user).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('api/users/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush(expectedResponse);
  });

  it('should PUT to /api/users/:id when editUser is called', () => {
    const user = { id: 1, username: 'alice', role: 'admin' };
    const expectedResponse = { ...user, username: 'alice_updated' };

    service.editUser(user).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('api/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(user);
    req.flush(expectedResponse);
  });

  it('should PUT to /api/users/:id with password when updateUserPassword is called', () => {
    const userId = 1;
    const newPassword = 'newpassword123';
    const expectedResponse = { id: 1, username: 'alice', role: 'admin' };

    service.updateUserPassword(userId, newPassword).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('api/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ password: newPassword });
    req.flush(expectedResponse);
  });

  it('should handle error responses', () => {
    const errorMessage = 'User not found';

    service.getUserById(999).subscribe({
      next: () => fail('should have failed'),
      error: error => {
        expect(error.status).toBe(404);
        expect(error.error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('api/users/999');
    req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });
  });
});
