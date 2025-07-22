import { Component, inject, OnInit } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../../shared/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-user-form-page',
  imports: [UserFormComponent, MatError, MatProgressSpinnerModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss'
})
export class UserFormPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(UsersFacadeService);
  private dialog = inject(MatDialog);

  user = this.facade.user;
  loading = this.facade.loading;
  error = this.facade.error;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.loadUserById(Number(id));
      // Fallback: if user not found, redirect after a short delay
      setTimeout(() => {
        if (this.error() === 'Failed to load user') {
          this.router.navigate(['/users']);
        }
      }, 1500);
    } else {
      // If creating, clear any previous user
      this.facade.clearUser();
    }
  }

  async handleSave(user: Partial<User>) {
    this.facade.saveUser(user);
    // Wait for loading to become false
    while (this.loading()) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    if (!this.error()) {
      this.goBack();
    }
    // If error, error message will be shown in template
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      data: { userId: this.user()?.id }
    });

    dialogRef.afterClosed().subscribe(async (newPassword: string) => {
      await this.handlePasswordChangeResult(newPassword);
    });
  }

  private async handlePasswordChangeResult(newPassword: string): Promise<void> {
    if (newPassword && this.user()?.id) {
      try {
        // Call the backend to update the password
        await this.facade.updateUserPassword(this.user()!.id, newPassword);

        // Show success message (you could add a snackbar here)
        console.log('Password updated successfully');

        // Optionally log out the user (step 3.3.5)
        // this.authService.logout();
        // this.router.navigate(['/auth']);
      } catch (error) {
        console.error('Failed to update password:', error);
        // Handle error (you could add error handling here)
      }
    }
  }
}
