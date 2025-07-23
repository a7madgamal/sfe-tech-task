import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SFE Task - Ahmed Hassanein';

  private router = inject(Router);
  private auth = inject(AuthService);
  private tokenService = inject(TokenService);

  currentUser = computed(() => this.tokenService.getCurrentUser());

  isLoggedIn = computed(() => !!this.currentUser());

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
