import { Routes } from '@angular/router';
import { LandlordDashboardComponent } from './landlord-dashboard/landlord-dashboard.component';
import { UploadAccommodationPageComponent } from './upload-accommodation-page/upload-accommodation-page.component';
import { LandlordProfilePageComponent } from './landlord-profile-page/landlord-profile-page.component';
import { EditLandlordProfilePageComponent } from './edit-landlord-profile-page/edit-landlord-profile-page.component';

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
    path: 'profile',
    component: LandlordProfilePageComponent
  },
  {
    path: 'profile/edit',
    component: EditLandlordProfilePageComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

