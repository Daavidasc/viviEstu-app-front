import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
{
    path: 'student',
    // La redirección irá aquí: /student/dashboard
    loadChildren: () => import('./features/student/student.routes').then(m => m.studentRoutes)
  },
  {
    path: 'landlord',
    // La redirección irá aquí: /landlord/dashboard
    loadChildren: () => import('./features/landlord/landlord.routes').then(m => m.landlordRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./features/landing/home.routes').then(m => m.homeRoutes)
  },
  {
    path: '**', // Ruta comodín para cualquier URL no encontrada
    redirectTo: '' // Redirige a la landing page
  }
];
