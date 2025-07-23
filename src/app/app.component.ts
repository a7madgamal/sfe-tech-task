import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SFE Tech Task';

  private router = inject(Router);
  private auth = inject(AuthService);
  private tokenService = inject(TokenService);

  get currentUser() {
    return this.tokenService.getCurrentUser();
  }

  get isLoggedIn() {
    return !!this.currentUser;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
