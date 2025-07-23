import { Component, input, output } from '@angular/core';
import { User } from '../../../shared/models/user';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users = input.required<User[]>();
  currentUser = input.required<{ id: number; username: string; role: string } | null>();

  edit: OutputEmitterRef<number> = output();

  displayedColumns: string[] = ['username', 'role', 'actions'];

  canEditUser(user: User): boolean {
    // Non-admin users cannot edit admin users
    if (this.currentUser()?.role !== 'admin' && user.role === 'admin') {
      return false;
    }
    return true;
  }
}
