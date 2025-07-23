import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ChangePasswordDialogComponent', () => {
  let component: ChangePasswordDialogComponent;
  let fixture: ComponentFixture<ChangePasswordDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ChangePasswordDialogComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ChangePasswordDialogComponent,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { userId: 1 } },
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ChangePasswordDialogComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.form.get('newPassword')?.value).toBe('');
    expect(component.form.get('confirmPassword')?.value).toBe('');
    expect(component.form.valid).toBeFalse();
  });

  it('should require both password fields', () => {
    const newPasswordControl = component.form.get('newPassword');
    const confirmPasswordControl = component.form.get('confirmPassword');

    expect(newPasswordControl?.hasError('required')).toBeTrue();
    expect(confirmPasswordControl?.hasError('required')).toBeTrue();
  });

  it('should validate password minimum length', () => {
    const newPasswordControl = component.form.get('newPassword');
    newPasswordControl?.setValue('123');
    expect(newPasswordControl?.hasError('minlength')).toBeTrue();

    newPasswordControl?.setValue('123456');
    expect(newPasswordControl?.hasError('minlength')).toBeFalse();
  });

  it('should validate password contains number', () => {
    const newPasswordControl = component.form.get('newPassword');
    newPasswordControl?.setValue('abcdef');
    expect(newPasswordControl?.hasError('numberRequired')).toBeTrue();

    newPasswordControl?.setValue('abcdef1');
    expect(newPasswordControl?.hasError('numberRequired')).toBeFalse();
  });

  it('should validate passwords match', () => {
    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'different123'
    });

    expect(component.showPasswordMismatch()).toBeTrue();
  });

  it('should not show mismatch when passwords match', () => {
    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123'
    });

    expect(component.showPasswordMismatch()).toBeFalse();
  });

  it('should not show mismatch when only one password is entered', () => {
    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: ''
    });

    expect(component.showPasswordMismatch()).toBeFalse();
  });

  it('should toggle password visibility', () => {
    expect(component.showNew()).toBeFalse();
    expect(component.showConfirm()).toBeFalse();

    component.toggleShowNew();
    expect(component.showNew()).toBeTrue();

    component.toggleShowConfirm();
    expect(component.showConfirm()).toBeTrue();
  });

  it('should close dialog on cancel', () => {
    component.cancel();
    component.onFadeDone({ toState: 'void' });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog with password on valid submit', () => {
    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123'
    });
    component.submit();
    component.onFadeDone({ toState: 'void' });
    expect(dialogRef.close).toHaveBeenCalledWith('password123');
  });

  it('should not close dialog on invalid submit', () => {
    component.form.setValue({
      newPassword: '123',
      confirmPassword: 'different'
    });

    component.submit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should mark fields as touched on invalid submit', () => {
    const newPasswordControl = component.form.get('newPassword');
    const confirmPasswordControl = component.form.get('confirmPassword');

    component.submit();

    expect(newPasswordControl?.touched).toBeTrue();
    expect(confirmPasswordControl?.touched).toBeTrue();
  });

  it('should handle keyboard events', () => {
    const submitSpy = spyOn(component, 'submit');
    const cancelSpy = spyOn(component, 'cancel');

    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.handleKeyDown(enterEvent);
    expect(submitSpy).toHaveBeenCalled();

    // Test Escape key
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    component.handleKeyDown(escapeEvent);
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should not submit on Shift+Enter', () => {
    const submitSpy = spyOn(component, 'submit');
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.handleKeyDown(event);
    expect(submitSpy).not.toHaveBeenCalled();
  });
});
