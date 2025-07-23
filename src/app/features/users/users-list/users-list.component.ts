import { Component, input, output } from '@angular/core';
import { User } from '../../../shared/models/user';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users = input.required<User[]>();

  edit: OutputEmitterRef<number> = output();

  displayedColumns: string[] = ['username', 'role', 'actions'];
}
