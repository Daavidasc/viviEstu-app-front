import { Routes } from '@angular/router';
import { LandlordDashboardComponent } from './landlord-dashboard/landlord-dashboard.component';
import { UploadAccommodationPageComponent } from './upload-accommodation-page/upload-accommodation-page.component';
import { LandlordProfilePageComponent } from './landlord-profile-page/landlord-profile-page.component';
import { EditLandlordProfilePageComponent } from './edit-landlord-profile-page/edit-landlord-profile-page.component';
import { LandlordAccommodationDetailComponent } from './landlord-accommodation-detail/landlord-accommodation-detail.component';
import { AccommodationRequestsPageComponent } from './accommodation-requests-page/accommodation-requests-page.component';
import { MyAccommodationsPageComponent } from './my-accommodations-page/my-accommodations-page.component';
import { RoleType } from '../../core/models/auth.models';
import { authGuard } from '../../core/guards/auth.guard';

const LANDLORD_ROLE = [RoleType.ROLE_PROPIETARIO];

export const landlordRoutes: Routes = [
  {
    path: 'dashboard',
    component: LandlordDashboardComponent,
    canActivate: [authGuard], // 👈 APLICAR GUARD
    data: { roles: LANDLORD_ROLE } // 👈 REQUERIR ROL
  },
  {
    path: 'requests',
    component: AccommodationRequestsPageComponent,
    canActivate: [authGuard],
    data: { roles: LANDLORD_ROLE }
  },
  {
    path: 'upload',
    component: UploadAccommodationPageComponent,
    canActivate: [authGuard],
    data: { roles: LANDLORD_ROLE }
  },
  {
    path: 'accommodations/:id',
    component: LandlordAccommodationDetailComponent,
    canActivate: [authGuard],
    data: { roles: LANDLORD_ROLE }
  },
  {
    path: 'profile',
    component: LandlordProfilePageComponent,
    canActivate: [authGuard],
    data: { roles: LANDLORD_ROLE }
  },
  {
    path: 'profile/edit',
    component: EditLandlordProfilePageComponent,
    canActivate: [authGuard],
    data: { roles: LANDLORD_ROLE }
  },
  {
    path: 'my-accommodations',
    component: MyAccommodationsPageComponent,
    canActivate: [authGuard],
    data: { roles: LANDLORD_ROLE }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
