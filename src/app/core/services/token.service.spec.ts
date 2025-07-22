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
});
