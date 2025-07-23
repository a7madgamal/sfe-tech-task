import { Component, inject, input, output, OutputEmitterRef, Input, effect } from '@angular/core';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  user = input<User | null>();
  @Input() disabled = false;

  save: OutputEmitterRef<Partial<User>> = output();
  cancel: OutputEmitterRef<void> = output();
  changePassword: OutputEmitterRef<void> = output();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', [Validators.required, this.noTestValidator]],
    role: ['', Validators.required],
    password: ['']
  });

  constructor() {
    effect(() => {
      const u = this.user();
      console.log('User for patchValue:', u);
      if (u) {
        // For existing users, only patch username and role, exclude password
        this.form.patchValue({
          username: u.username,
          role: u.role
        });
        // Remove password validation for existing users
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
      } else {
        // For new users, add password validation
        this.form.get('password')?.setValidators([Validators.required]);
        this.form.get('password')?.updateValueAndValidity();
      }
    });
  }

  get username() {
    return this.form.get('username');
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

    const userData = { ...this.user(), ...this.form.value };

    // For existing users, exclude password from the data
    if (this.user()?.id) {
      delete userData.password;
    }

    this.save.emit(userData as Partial<User>);
  }
}
