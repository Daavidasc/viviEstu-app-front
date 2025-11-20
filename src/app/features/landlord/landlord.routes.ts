import { Routes } from '@angular/router';
import { LandlordDashboardComponent } from './landlord-dashboard/landlord-dashboard.component';
import { UploadAccommodationPageComponent } from './upload-accommodation-page/upload-accommodation-page.component';

export const landlordRoutes: Routes = [
  {
    path: 'dashboard',
    component: LandlordDashboardComponent
  },
  {
    path: 'upload',
    component: UploadAccommodationPageComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

