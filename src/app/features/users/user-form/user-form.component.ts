import { Component, inject, input, output, OutputEmitterRef, Input, effect, NgZone } from '@angular/core';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { passwordValidators } from '../../../shared/password-validators';
import { TouchedAndDirtyErrorStateMatcher } from '../../../shared/always-error-state-matcher';
import { ErrorStateMatcher } from '@angular/material/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { signal } from '@angular/core';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  animations: [
    trigger('dialogFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.98)' }),
        animate('200ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'scale(0.98)' }))
      ])
    ])
  ]
})
export class UserFormComponent {
  user = input<User | null>();
  currentUser = input<{ id: number; username: string; role: string } | null>();
  @Input() disabled = false;
  @Input() error: string | null = null;

  saveUser: OutputEmitterRef<Partial<User>> = output();
  cancelUser: OutputEmitterRef<void> = output();
  changeUserPassword: OutputEmitterRef<void> = output();

  show = signal(true);

  private fb = inject(FormBuilder);
  private lastUserRef: User | null | undefined = undefined;
  private formInitialized = false;

  matcher: ErrorStateMatcher = new TouchedAndDirtyErrorStateMatcher();

  form = this.fb.group({
    username: ['', [Validators.required, this.noTestValidator]],
    role: ['', Validators.required],
    password: ['', passwordValidators()]
  });

  private ngZone = inject(NgZone);
  constructor() {
    effect(() => {
      const u = this.user();
      // Only patch if the user object reference changes (edit mode)
      // or on the very first mount (formInitialized === false)
      if (!this.formInitialized || (u && u !== this.lastUserRef)) {
        this.lastUserRef = u;
        this.updateForm();
        this.formInitialized = true;
      }
    });
  }

  onPasswordFocus() {
    this.ngZone.run(() => {
      this.form.get('password')?.markAsDirty();
      this.form.get('password')?.markAllAsTouched();
    });
  }

  private updateForm(): void {
    const u = this.user();
    const canCreateAdmin = this.canCreateAdmin();

    if (u) {
      this.form.patchValue(
        {
          username: u.username,
          role: u.role
        },
        { emitEvent: false }
      );
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity({ emitEvent: false });
    } else {
      this.form.get('password')?.setValidators(passwordValidators());
      this.form.get('password')?.updateValueAndValidity({ emitEvent: false });
      // Do NOT patch the password field value here
      this.form.patchValue({ role: 'user' }, { emitEvent: false });
    }

    if (!canCreateAdmin) {
      this.form.get('role')?.disable({ emitEvent: false });
    } else {
      this.form.get('role')?.enable({ emitEvent: false });
    }
  }

  get username() {
    return this.form.get('username');
  }

  canCreateAdmin(): boolean {
    const currentU = this.currentUser();
    return currentU?.role === 'admin';
  }

  getRoleTooltip(): string {
    return this.canCreateAdmin() ? 'Select the user role' : 'Only admins can create admin accounts';
  }

  // Custom validator to block 'test' in username
  noTestValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value === 'string' && value.toLowerCase().includes('test')) {
      return { testNotAllowed: true };
    }
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.show.set(false); // triggers fade-out
  }

  onFadeDone(event: { toState: string }) {
    if (event.toState === 'void') {
      if (this.form.valid && this.form.dirty) {
        // Only emit save if submit was called
        const formValue = this.form.getRawValue();
        const userData = { ...this.user(), ...formValue };
        // Ensure username, role, and password are strings (not null)
        const safeUserData: Partial<User> = {
          ...userData,
          username: userData.username ?? '',
          role: userData.role ?? '',
          password: userData.password ?? undefined
        };
        if (this.user()?.id) {
          // Remove password for existing user
          if ('password' in safeUserData) {
            delete safeUserData.password;
          }
          this.saveUser.emit(safeUserData);
        } else {
          // For new user, ensure password is included
          this.saveUser.emit(safeUserData);
        }
      } else {
        // If cancel was called, emit cancel
        this.cancelUser.emit();
      }
    }
  }

  onCancel() {
    this.show.set(false); // triggers fade-out, will emit cancel after
  }
}
