import { Routes } from '@angular/router';
import { LandlordDashboardComponent } from './landlord-dashboard/landlord-dashboard.component';

export const landlordRoutes: Routes = [
  {
    path: 'dashboard',
    component: LandlordDashboardComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

