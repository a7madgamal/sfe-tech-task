import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { UserFormComponent } from '../user-form/user-form.component';

import { UserFormPageComponent } from './user-form-page.component';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';
import { AuthService } from '../../../core/services/auth.service';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('UserFormPageComponent', () => {
  let component: UserFormPageComponent;
  let fixture: ComponentFixture<UserFormPageComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let facade: jasmine.SpyObj<UsersFacadeService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let authService: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const facadeSpy = jasmine.createSpyObj('UsersFacadeService', [
      'loadUserById',
      'clearUser',
      'saveUser',
      'updateUserPassword'
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    // Mock signals as callable functions
    facadeSpy.user = jasmine.createSpy('user').and.returnValue({ id: 1, username: 'testuser', role: 'user' });
    facadeSpy.loading = jasmine.createSpy('loading').and.returnValue(false);
    facadeSpy.error = jasmine.createSpy('error').and.returnValue('');

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserFormPageComponent, MatDialogModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UsersFacadeService, useValue: facadeSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormPageComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    facade = TestBed.inject(UsersFacadeService) as jasmine.SpyObj<UsersFacadeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user by ID when route has ID parameter', () => {
    expect(facade.loadUserById).toHaveBeenCalledWith(1);
  });

  it('should clear user when creating new user', () => {
    // Reset component and test with no ID
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [UserFormPageComponent, MatDialogModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: AuthService, useValue: authService },
        { provide: UsersFacadeService, useValue: facade },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    const newFixture = TestBed.createComponent(UserFormPageComponent);
    newFixture.detectChanges();

    expect(facade.clearUser).toHaveBeenCalled();
  });

  it('should handle save user', async () => {
    const testUser = { id: 1, username: 'testuser', role: 'user' };
    facade.saveUser.and.stub();

    await component.handleSave(testUser);

    expect(facade.saveUser).toHaveBeenCalledWith(testUser);
  });

  it('should navigate back on goBack', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should navigate back when cancelUser is emitted from the form', () => {
    // Find the child component using By.directive
    const userFormDebug = fixture.debugElement.query(By.directive(UserFormComponent));
    expect(userFormDebug).toBeTruthy();
    // Spy on goBack
    const goBackSpy = spyOn(component, 'goBack').and.callThrough();
    // Emit cancelUser from the child
    userFormDebug.componentInstance.cancelUser.emit();
    fixture.detectChanges();
    expect(goBackSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  // Test password change functionality by testing the core logic
  describe('Password Change', () => {
    it('should call facade updateUserPassword when password is provided', async () => {
      const newPassword = 'newpassword123';
      facade.updateUserPassword.and.returnValue(Promise.resolve());

      // Simulate the dialog result directly
      await component['handlePasswordChangeResult'](newPassword);

      expect(facade.updateUserPassword).toHaveBeenCalledWith(1, newPassword);
    });

    it('should not call facade updateUserPassword when no password is provided', async () => {
      // Simulate the dialog result directly
      await component['handlePasswordChangeResult']('');

      expect(facade.updateUserPassword).not.toHaveBeenCalled();
    });

    it('should handle password change API error', async () => {
      const newPassword = 'newpassword123';
      const error = new Error('API Error');
      facade.updateUserPassword.and.returnValue(Promise.reject(error));
      const consoleSpy = spyOn(console, 'error');

      // Simulate the dialog result directly
      await component['handlePasswordChangeResult'](newPassword);

      expect(facade.updateUserPassword).toHaveBeenCalledWith(1, newPassword);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to update password:', error);
    });
  });
});
