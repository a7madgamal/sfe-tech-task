import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TokenService } from '../../../core/services/token.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AnimationEvent } from '@angular/animations';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatCard,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatToolbarModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  animations: [
    trigger('loginCardFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px) scale(0.98)' }),
        animate('700ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'none' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'translateY(24px) scale(0.98)' }))
      ])
    ])
  ]
})
export class LoginPageComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  error: WritableSignal<string> = signal('');
  showCard = signal(true);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.value;
    this.authService.login(username!, password!).subscribe({
      next: res => {
        this.tokenService.setToken(res.token);
        this.error.set('');
        this.showCard.set(false); // Trigger fade-out
      },
      error: err => {
        if (err.status === 0) {
          this.error.set('Could not reach server. Please try again later.');
        } else if (err.status === 401) {
          this.error.set('Invalid username or password');
        } else {
          this.error.set('Unexpected server error. Please try again.');
        }
      }
    });
  }

  onFadeDone(event: AnimationEvent) {
    if (event.toState === 'void') {
      this.router.navigate(['/users']);
    }
  }
}
