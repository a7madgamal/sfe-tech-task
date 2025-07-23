import { Component, inject, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TouchedAndDirtyErrorStateMatcher } from '../../../shared/always-error-state-matcher';
import { ErrorStateMatcher } from '@angular/material/core';
import { passwordValidators } from '../../../shared/password-validators';
import { trigger, transition, style, animate } from '@angular/animations';

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
    <div class="dialog-container" *ngIf="show()" @dialogFade (@dialogFade.done)="onFadeDone($event)">
      <h2 mat-dialog-title>Change Password</h2>

      <div class="dialog-scroll-wrapper">
        <mat-dialog-content>
          <form [formGroup]="form" (ngSubmit)="submit()" #passwordForm="ngForm">
            <mat-form-field appearance="fill">
              <mat-label>New Password</mat-label>
              <input
                matInput
                [type]="showNew() ? 'text' : 'password'"
                formControlName="newPassword"
                tabindex="1"
                [errorStateMatcher]="matcher"
                (input)="onFieldInput('newPassword')"
              />
              <button mat-icon-button matSuffix type="button" (click)="toggleShowNew()" tabindex="2">
                <mat-icon>{{ showNew() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('newPassword')?.hasError('required') && form.get('newPassword')?.dirty">
                Password is required
              </mat-error>
              <mat-error *ngIf="form.get('newPassword')?.hasError('minlength') && form.get('newPassword')?.dirty">
                Password must be at least 6 characters
              </mat-error>
              <mat-error *ngIf="form.get('newPassword')?.hasError('numberRequired') && form.get('newPassword')?.dirty">
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
                [errorStateMatcher]="matcher"
                (input)="onFieldInput('confirmPassword')"
              />
              <button mat-icon-button matSuffix type="button" (click)="toggleShowConfirm()" tabindex="4">
                <mat-icon>{{ showConfirm() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error
                *ngIf="form.get('confirmPassword')?.hasError('required') && form.get('confirmPassword')?.dirty"
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
      </div>

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
      .dialog-scroll-wrapper {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        display: flex;
        flex-direction: column;
      }

      @media (max-width: 600px) {
        .dialog-scroll-wrapper {
          max-height: 60vh;
          min-height: 0;
          overflow: auto;
        }
      }

      mat-dialog-content {
        padding: var(--spacing-lg) var(--spacing-md);
        min-height: 200px;
        flex: 1 1 auto;
        min-height: 0;
      }

      mat-dialog-actions {
        padding: var(--spacing-md) var(--spacing-md) var(--spacing-lg);
        margin: 0;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: var(--spacing-md);
      }
      mat-form-field:last-of-type {
        margin-bottom: 0;
      }

      h2[mat-dialog-title] {
        margin: 0;
        padding: var(--spacing-lg) var(--spacing-md) 0;
        margin-bottom: var(--spacing-md);
      }

      mat-error {
        font-size: 12px;
        line-height: 1.2;
        margin-top: 4px;
      }

      /* Ensure error messages don't cause layout shifts */
      mat-form-field.mat-form-field-invalid {
        margin-bottom: 32px;
      }
    `
  ],
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
export class ChangePasswordDialogComponent implements OnInit, OnDestroy {
  dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  data = inject(MAT_DIALOG_DATA, { optional: true });
  fb = inject(FormBuilder);
  showNew = signal(false);
  showConfirm = signal(false);
  showPasswordMismatch = signal(false);
  show = signal(true);
  private formSubscription?: Subscription;
  matcher: ErrorStateMatcher = new TouchedAndDirtyErrorStateMatcher();

  form = this.fb.group(
    {
      newPassword: ['', passwordValidators()],
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
    this.show.set(false); // triggers fade-out
  }

  submit(): void {
    if (this.form.valid) {
      this.show.set(false); // triggers fade-out
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

  onFieldInput(field: 'newPassword' | 'confirmPassword') {
    const control = this.form.get(field);
    if (control && !control.dirty) {
      control.markAsDirty();
    }
    if (control && !control.touched) {
      control.markAsTouched();
    }
  }

  onFadeDone(event: any) {
    if (event.toState === 'void') {
      if (this.form.valid) {
        this.dialogRef.close(this.form.value.newPassword);
      } else {
        this.dialogRef.close();
      }
    }
  }
}
