import { Injectable, signal } from '@angular/core';
import { User } from '../../shared/models/user';

@Injectable({ providedIn: 'root' })
export class UserStore {
  users = signal<User[]>([]);
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal('');

  setUsers(newUsers: User[]) {
    this.users.set(newUsers);
  }

  setUser(newUser: User | null) {
    this.user.set(newUser);
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  setError(message: string) {
    this.error.set(message);
  }

  upsertUser(user: User) {
    const current = this.users();
    const index = current.findIndex(u => u.id === user.id);
    if (index === -1) {
      this.users.set([...current, user]);
    } else {
      const updated = [...current];
      updated[index] = user;
      this.users.set(updated);
    }
  }
}
