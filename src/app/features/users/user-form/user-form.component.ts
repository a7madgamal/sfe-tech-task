import { Component, inject, input, output, OutputEmitterRef, Input } from '@angular/core';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  user = input<User | null>();
  @Input() disabled = false;

  save: OutputEmitterRef<Partial<User>> = output();
  cancel: OutputEmitterRef<void> = output();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', [Validators.required, this.noTestValidator]],
    role: ['', Validators.required],
    password: ['']
  });

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
    this.save.emit(userData as Partial<User>);
  }
}
