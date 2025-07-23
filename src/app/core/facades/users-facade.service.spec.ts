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
      'updateUserPassword'
    ]);
    userStore = jasmine.createSpyObj('UserStore', ['setUser', 'setUsers', 'setLoading', 'setError', 'upsertUser']);
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

  it('should load users and update store on success', () => {
    const mockUsers = [mockUser];
    usersService.getUsers.and.returnValue(of(mockUsers));
    service.loadUsers();
    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.getUsers).toHaveBeenCalled();
    expect(userStore.setUsers).toHaveBeenCalledWith(mockUsers);
    expect(userStore.setError).toHaveBeenCalledWith('');
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should set error on loadUsers failure', () => {
    usersService.getUsers.and.returnValue(throwError(() => new Error('fail')));
    service.loadUsers();
    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(userStore.setError).toHaveBeenCalledWith('Failed to load users');
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should load user by id and update store on success', () => {
    usersService.getUserById.and.returnValue(of(mockUser));
    service.loadUserById(1);
    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.getUserById).toHaveBeenCalledWith(1);
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

  it('should add user and update store on success', () => {
    const newUser = { username: 'bob', role: 'user', password: 'pass' };
    const savedUser = { ...newUser, id: 2 };
    usersService.addUser.and.returnValue(of(savedUser));
    service.saveUser(newUser);
    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.addUser).toHaveBeenCalledWith(newUser);
    expect(userStore.upsertUser).toHaveBeenCalledWith(savedUser);
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should edit user and update store on success', () => {
    const editUser = { id: 1, username: 'alice_updated', role: 'admin' };
    usersService.editUser.and.returnValue(of(editUser));
    service.saveUser(editUser);
    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.editUser).toHaveBeenCalledWith(editUser);
    expect(userStore.upsertUser).toHaveBeenCalledWith(editUser);
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should set error on saveUser failure', () => {
    const user = { username: 'bob', role: 'user', password: 'pass' };
    usersService.addUser.and.returnValue(throwError(() => new Error('fail')));
    service.saveUser(user);
    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(userStore.setError).toHaveBeenCalledWith('Failed to save user');
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should update user password and resolve on success', async () => {
    const userId = 1;
    const newPassword = 'newpassword123';
    usersService.updateUserPassword.and.returnValue(of(mockUser));

    await service.updateUserPassword(userId, newPassword);

    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(usersService.updateUserPassword).toHaveBeenCalledWith(userId, newPassword);
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should reject and set error on updateUserPassword failure', async () => {
    const userId = 1;
    const newPassword = 'newpassword123';
    const error = new Error('API Error');
    usersService.updateUserPassword.and.returnValue(throwError(() => error));

    try {
      await service.updateUserPassword(userId, newPassword);
      fail('should have thrown an error');
    } catch (e) {
      expect(e).toBe(error);
    }

    expect(userStore.setLoading).toHaveBeenCalledWith(true);
    expect(userStore.setError).toHaveBeenCalledWith('Failed to update password');
    expect(userStore.setLoading).toHaveBeenCalledWith(false);
  });
});
