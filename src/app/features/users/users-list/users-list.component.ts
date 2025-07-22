import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { User } from '../../../shared/models/user';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-users-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, MatChipsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users = input<User[]>();

  edit: OutputEmitterRef<number> = output();
  delete: OutputEmitterRef<number> = output();

  constructor(private tokenService: TokenService) {}

  get currentUser() {
    return this.tokenService.getCurrentUser();
  }
}
