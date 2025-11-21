import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.routes').then(m => m.landingRoutes)
  },
  {
    path: 'dashboard',
    // Componente privado, por ejemplo
    loadComponent: () => import('./features/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
    canActivate: [authGuard] // AÑADIDO: Protege la ruta, requiere token/sesión
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student/student.routes').then(m => m.studentRoutes)
    // Aquí iría un CanActivate guard para proteger la ruta
  }
];
