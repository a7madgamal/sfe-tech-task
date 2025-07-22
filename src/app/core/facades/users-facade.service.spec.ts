import { TestBed } from '@angular/core/testing';

import { UsersFacadeService } from './users-facade.service';
import { UsersService } from '../services/users.service';
import { UserStore } from '../stores/users.store';
import { of, throwError } from 'rxjs';

const mockUser = { id: 1, username: 'alice', role: 'admin' };

describe('UsersFacadeService', () => {
  let service: UsersFacadeService;
  let usersService: jasmine.SpyObj<UsersService>;
  let userStore: jasmine.SpyObj<UserStore>;

  beforeEach(() => {
    usersService = jasmine.createSpyObj('UsersService', [
      'getUserById',
      'getUsers',
      'addUser',
      'editUser',
      'deleteUser'
    ]);
    userStore = jasmine.createSpyObj('UserStore', [
      'setUser',
      'setUsers',
      'setLoading',
      'setError',
      'upsertUser',
      'deleteUser'
    ]);
    // Mock asReadonly for signals
    userStore.users = { asReadonly: () => of([]) } as any;
    userStore.user = { asReadonly: () => of(null) } as any;
    userStore.loading = { asReadonly: () => of(false) } as any;
    userStore.error = { asReadonly: () => of('') } as any;
    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: UserStore, useValue: userStore }
      ]
    });
    service = TestBed.inject(UsersFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load user by id and update store on success', () => {
    usersService.getUserById.and.returnValue(of(mockUser));
    service.loadUserById(1);
    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.getUserById).toHaveBeenCalledWith(1);
    // Simulate observable next
    expect(userStore.setUser).toHaveBeenCalledWith(mockUser);
    expect(userStore.setError).toHaveBeenCalledWith('');
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should set error on loadUserById failure', () => {
    usersService.getUserById.and.returnValue(throwError(() => new Error('fail')));
    service.loadUserById(2);
    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.getUserById).toHaveBeenCalledWith(2);
    expect(userStore.setError).toHaveBeenCalledWith('Failed to load user');
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should clear user in store', () => {
    service.clearUser();
    expect(userStore.setUser).toHaveBeenCalledWith(null);
  });
});
