import { Component, inject, computed } from '@angular/core';
import { UsersListComponent } from '../users-list/users-list.component';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-users-list-page',
  imports: [UsersListComponent, MatButton, MatProgressSpinnerModule, MatError, MatIconModule],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss'
})
export class UsersListPageComponent implements OnInit {
  facade = inject(UsersFacadeService);
  router = inject(Router);
  tokenService = inject(TokenService);

  currentUser = computed(() => this.tokenService.getCurrentUser());

  ngOnInit(): void {
    this.facade.loadUsers();
  }

  goToNew(): void {
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/users', id]);
  }
}
