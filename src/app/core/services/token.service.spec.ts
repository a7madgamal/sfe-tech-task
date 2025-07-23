import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  const TOKEN_KEY = 'auth_token';
  const TEST_TOKEN = 'test-token-123';

  beforeEach(() => {
    service = new TokenService();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve a token', () => {
    service.setToken(TEST_TOKEN);
    expect(sessionStorage.getItem(TOKEN_KEY)).toBe(TEST_TOKEN);
    expect(service.getToken()).toBe(TEST_TOKEN);
  });

  it('should clear the token', () => {
    service.setToken(TEST_TOKEN);
    service.clearToken();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(service.getToken()).toBeNull();
  });

  it('should set and get user via signal', () => {
    expect(service.getCurrentUser()).toBeNull();
    service.setUser({ id: 1, username: 'alice', role: 'admin' });
    expect(service.getCurrentUser()).toEqual({ id: 1, username: 'alice', role: 'admin' });
    expect(service.currentUser()).toEqual({ id: 1, username: 'alice', role: 'admin' });
  });

  it('should clear user and update signal', () => {
    service.setUser({ id: 2, username: 'bob', role: 'user' });
    expect(service.getCurrentUser()).not.toBeNull();
    service.clearToken();
    expect(service.getCurrentUser()).toBeNull();
    expect(service.currentUser()).toBeNull();
  });

  it('should reflect sessionStorage changes on reload', () => {
    service.setUser({ id: 3, username: 'carol', role: 'user' });
    // Simulate reload by creating a new instance
    const newService = new TokenService();
    expect(newService.getCurrentUser()).toEqual({ id: 3, username: 'carol', role: 'user' });
    expect(newService.currentUser()).toEqual({ id: 3, username: 'carol', role: 'user' });
  });
});
