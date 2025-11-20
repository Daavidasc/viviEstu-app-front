import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '',
    //loadChildren: () => import('./features/landing/home.routes').then(m => m.homeRoutes)
    loadChildren: () => import('./features/landing/landing.routes').then(m => m.landingRoutes)
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student/student.routes').then(m => m.studentRoutes)
    // Aquí iría un CanActivate guard para proteger la ruta
  }
];
