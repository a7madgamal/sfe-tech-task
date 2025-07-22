import { Component, inject } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../../shared/models/user';
import { Router } from '@angular/router';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-user-form-page',
  imports: [UserFormComponent, MatError],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss'
})
export class UserFormPageComponent {
  private router = inject(Router);
  private facade = inject(UsersFacadeService);

  user = this.facade.user;
  loading = this.facade.loading;
  error = this.facade.error;

  handleSave(user: Partial<User>) {
    this.facade.saveUser(user);
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
