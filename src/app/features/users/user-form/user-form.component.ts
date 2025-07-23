import { Component, inject, input, output, OutputEmitterRef, Input, effect } from '@angular/core';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  user = input<User | null>();
  currentUser = input<{ id: number; username: string; role: string } | null>();
  @Input() disabled = false;

  save: OutputEmitterRef<Partial<User>> = output();
  cancel: OutputEmitterRef<void> = output();
  changePassword: OutputEmitterRef<void> = output();

  private fb = inject(FormBuilder);
  private previousUser: User | null | undefined = null;
  private previousCurrentUser: { id: number; username: string; role: string } | null | undefined = null;

  form = this.fb.group({
    username: ['', [Validators.required, this.noTestValidator]],
    role: ['', Validators.required],
    password: ['']
  });

  constructor() {
    // Initialize form with default values
    this.form.patchValue({ role: 'user' }, { emitEvent: false });

    effect(() => {
      const u = this.user();
      const currentU = this.currentUser();

      // Only update if the user actually changed OR if currentUser changed
      if (u !== this.previousUser || currentU !== this.previousCurrentUser) {
        this.previousUser = u;
        this.previousCurrentUser = currentU;
        this.updateForm();
      }
    });
  }

  private updateForm(): void {
    const u = this.user();
    const canCreateAdmin = this.canCreateAdmin();

    if (u) {
      // For existing users, only patch username and role, exclude password
      this.form.patchValue(
        {
          username: u.username,
          role: u.role
        },
        { emitEvent: false }
      );
      // Remove password validation for existing users
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity({ emitEvent: false });
    } else {
      // For new users, add password validation and set default role
      this.form.get('password')?.setValidators([Validators.required]);
      this.form.get('password')?.updateValueAndValidity({ emitEvent: false });

      // Set default role to user for new users
      this.form.patchValue({ role: 'user' }, { emitEvent: false });
    }

    // Disable role control for non-admin users
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

    // Get form values, including disabled controls
    const formValue = this.form.getRawValue();
    const userData = { ...this.user(), ...formValue };

    // For existing users, exclude password from the data
    if (this.user()?.id) {
      const { password, ...userDataWithoutPassword } = userData;
      this.save.emit(userDataWithoutPassword as Partial<User>);
    } else {
      this.save.emit(userData as Partial<User>);
    }
  }
}
