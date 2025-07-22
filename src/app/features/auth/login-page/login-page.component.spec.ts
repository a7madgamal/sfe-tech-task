import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    tokenService = jasmine.createSpyObj('TokenService', ['setToken']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: TokenService, useValue: tokenService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not call AuthService.login if form is invalid and should mark fields as touched', () => {
    component.form.setValue({ username: '', password: '' });
    spyOn(component.form, 'markAllAsTouched');
    component.submit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call AuthService.login with form values on valid submit', () => {
    component.form.setValue({ username: 'user', password: 'pass' });
    authService.login.and.returnValue(of({ token: 'abc', user: { id: 1, username: 'user', role: 'user' } }));
    component.submit();
    expect(authService.login).toHaveBeenCalledWith('user', 'pass');
  });

  it('should store token, clear error, and navigate to /users on successful login', () => {
    component.form.setValue({ username: 'user', password: 'pass' });
    authService.login.and.returnValue(of({ token: 'abc', user: { id: 1, username: 'user', role: 'user' } }));
    component.error.set('Some error');
    component.submit();
    expect(tokenService.setToken).toHaveBeenCalledWith('abc');
    expect(component.error()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should set error message and not navigate on failed login', () => {
    component.form.setValue({ username: 'user', password: 'wrong' });
    authService.login.and.returnValue(throwError(() => new Error('Invalid')));
    component.submit();
    expect(component.error()).toBe('Invalid username or password');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
