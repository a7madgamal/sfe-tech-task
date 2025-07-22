import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UsersFacadeService } from './users-facade.service';

describe('UsersFacadeService', () => {
  let service: UsersFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UsersFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
