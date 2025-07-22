import { Component, inject, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Change Password</h2>

      <mat-dialog-content>
        <form [formGroup]="form" (ngSubmit)="submit()" #passwordForm="ngForm">
          <mat-form-field appearance="fill">
            <mat-label>New Password</mat-label>
            <input matInput [type]="showNew() ? 'text' : 'password'" formControlName="newPassword" tabindex="1" />
            <button mat-icon-button matSuffix type="button" (click)="toggleShowNew()" tabindex="2">
              <mat-icon>{{ showNew() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('newPassword')?.hasError('required') && form.get('newPassword')?.touched">
              Password is required
            </mat-error>
            <mat-error *ngIf="form.get('newPassword')?.hasError('minlength') && form.get('newPassword')?.touched">
              Password must be at least 6 characters
            </mat-error>
            <mat-error *ngIf="form.get('newPassword')?.hasError('numberRequired') && form.get('newPassword')?.touched">
              Password must contain a number
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Confirm Password</mat-label>
            <input
              matInput
              [type]="showConfirm() ? 'text' : 'password'"
              formControlName="confirmPassword"
              tabindex="3"
            />
            <button mat-icon-button matSuffix type="button" (click)="toggleShowConfirm()" tabindex="4">
              <mat-icon>{{ showConfirm() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error
              *ngIf="form.get('confirmPassword')?.hasError('required') && form.get('confirmPassword')?.touched"
            >
              Confirmation is required
            </mat-error>
          </mat-form-field>

          <!-- Password mismatch error - separate from mat-error -->
          <div
            *ngIf="showPasswordMismatch()"
            style="color: #f44336; font-size: 12px; margin-top: -16px; margin-bottom: 16px; padding-left: 16px;"
          >
            Passwords do not match
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-stroked-button type="button" (click)="cancel()" tabindex="5">Cancel</button>
        <button mat-flat-button color="primary" type="button" (click)="submit()" [disabled]="form.invalid" tabindex="6">
          Change
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 0;
        min-width: 400px;
      }

      mat-dialog-content {
        padding: 20px 24px;
        min-height: 280px;
      }

      mat-dialog-actions {
        padding: 8px 24px 24px;
        margin: 0;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 32px;
      }

      mat-form-field:last-of-type {
        margin-bottom: 0;
      }

      h2[mat-dialog-title] {
        margin: 0;
        padding: 24px 24px 0;
        margin-bottom: 16px;
      }

      /* Ensure error messages don't cause layout shifts */
      mat-error {
        font-size: 12px;
        line-height: 1.2;
        margin-top: 4px;
      }

      /* Give consistent space for error messages */
      mat-form-field.mat-form-field-invalid {
        margin-bottom: 32px;
      }
    `
  ]
})
export class ChangePasswordDialogComponent implements OnInit, OnDestroy {
  dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  data = inject(MAT_DIALOG_DATA, { optional: true });
  fb = inject(FormBuilder);
  showNew = signal(false);
  showConfirm = signal(false);
  showPasswordMismatch = signal(false);
  private formSubscription?: Subscription;

  form = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6), this.numberRequiredValidator]],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordsMatchValidator }
  );

  ngOnInit(): void {
    // Subscribe to form value changes to update password mismatch validation
    this.formSubscription = this.form.valueChanges.subscribe(values => {
      const newPw = values.newPassword;
      const confirmPw = values.confirmPassword;
      const bothHaveValues = !!(newPw && confirmPw);
      const passwordsMatch = newPw === confirmPw;

      this.showPasswordMismatch.set(bothHaveValues && !passwordsMatch);
    });

    // Focus the first field when dialog opens
    setTimeout(() => {
      const firstInput = document.querySelector('input[tabindex="1"]') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Enter key to submit form
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }

    // Escape key to close dialog
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
    }
  }

  numberRequiredValidator(control: any) {
    const value = control.value;
    if (value && !/\d/.test(value)) {
      return { numberRequired: true };
    }
    return null;
  }

  passwordsMatchValidator(group: any) {
    const pw = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { passwordMismatch: true };
  }

  toggleShowNew() {
    this.showNew.update(v => !v);
  }

  toggleShowConfirm() {
    this.showConfirm.update(v => !v);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.newPassword);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
          control.markAsDirty();
        }
      });
      this.form.markAllAsTouched();
    }
  }
}
