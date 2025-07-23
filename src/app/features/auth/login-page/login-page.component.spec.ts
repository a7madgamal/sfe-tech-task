import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

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
        { provide: Router, useValue: router },
        provideAnimations()
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

  it('should store token, clear error, and navigate to /users on successful login', async () => {
    component.form.setValue({ username: 'user', password: 'pass' });
    authService.login.and.returnValue(of({ token: 'abc', user: { id: 1, username: 'user', role: 'user' } }));
    component.error.set('Some error');
    component.submit();
    component.onFadeDone({
      fromState: '',
      toState: 'void',
      totalTime: 0,
      phaseName: 'done',
      element: {} as any,
      triggerName: 'loginCardFade',
      disabled: false
    });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(tokenService.setToken).toHaveBeenCalledWith('abc');
    expect(component.error()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should set error message and not navigate on failed login', fakeAsync(() => {
    component.form.setValue({ username: 'user', password: 'wrong' });
    authService.login.and.returnValue(throwError(() => new Error('Invalid')));
    component.submit();
    tick();
    expect(component.error()).toBe('Unexpected server error. Please try again.');
    expect(router.navigate).not.toHaveBeenCalled();
  }));
});
