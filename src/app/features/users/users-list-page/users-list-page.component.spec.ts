import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { UsersListPageComponent } from './users-list-page.component';
import { TokenService } from '../../../core/services/token.service';

describe('UsersListPageComponent', () => {
  let component: UsersListPageComponent;
  let fixture: ComponentFixture<UsersListPageComponent>;
  let tokenService: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['getCurrentUser'], {
      currentUser: () => tokenSpy.getCurrentUser()
    });
    tokenSpy.getCurrentUser.and.returnValue({ id: 1, username: 'admin', role: 'admin' });

    await TestBed.configureTestingModule({
      imports: [UsersListPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: TokenService, useValue: tokenSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListPageComponent);
    component = fixture.componentInstance;
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current user from token service', () => {
    const mockUser = { id: 1, username: 'admin', role: 'admin' };
    tokenService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit?.();
    expect(component.currentUser()).toEqual(mockUser);
    expect(tokenService.getCurrentUser).toHaveBeenCalled();
  });

  it('should handle null current user', () => {
    tokenService.getCurrentUser.and.returnValue(null);
    component.ngOnInit?.();
    expect(component.currentUser()).toBeNull();
  });
});
