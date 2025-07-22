import { Component, inject, OnInit } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../../shared/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-form-page',
  imports: [UserFormComponent, MatError, MatProgressSpinnerModule],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss'
})
export class UserFormPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(UsersFacadeService);

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
}
