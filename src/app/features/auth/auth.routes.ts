// auth/auth.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { publicGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard] // AÑADIDO: Si ya está logeado, no lo deja entrar
  },
    {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicGuard] // AÑADIDO: Si ya está logeado, no lo deja entrar
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
