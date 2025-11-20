import { Routes } from '@angular/router';
import { LandingLayoutComponent } from '../../shared/layouts/landing-layout';
import { LandingComponent } from './pages/landingComponent';

export const landingRoutes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        component: LandingComponent
      }
    ]
  }
];
