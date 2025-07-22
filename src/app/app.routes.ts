import { Routes } from '@angular/router';
import { USERS_PATH } from './features/users/users.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: USERS_PATH,
    loadChildren: () => import('./features/users/users.routes').then(r => r.USERS_ROUTES),
  },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
];
