import { Component, inject } from '@angular/core';
import { UsersListComponent } from '../users-list/users-list.component';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-users-list-page',
  imports: [UsersListComponent, MatButton, MatProgressSpinnerModule, MatError, MatIconModule],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss'
})
export class UsersListPageComponent implements OnInit {
  facade = inject(UsersFacadeService);
  router = inject(Router);
  auth = inject(AuthService);

  ngOnInit(): void {
    this.facade.loadUsers();
  }

  goToNew(): void {
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/users', id]);
  }

  deleteUser(id: number): void {
    this.facade.deleteUser(id);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
