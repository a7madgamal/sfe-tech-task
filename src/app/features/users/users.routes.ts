import { Routes } from '@angular/router';

export const USERS_PATH = 'users';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./users-list-page/users-list-page.component').then(c => c.UsersListPageComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./user-form-page/user-form-page.component').then(c => c.UserFormPageComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./user-form-page/user-form-page.component').then(c => c.UserFormPageComponent)
  }
];
