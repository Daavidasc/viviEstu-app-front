import { Routes } from '@angular/router';
import { LandlordDashboardComponent } from './landlord-dashboard/landlord-dashboard.component';
import { UploadAccommodationPageComponent } from './upload-accommodation-page/upload-accommodation-page.component';
import { LandlordProfilePageComponent } from './landlord-profile-page/landlord-profile-page.component';
import { EditLandlordProfilePageComponent } from './edit-landlord-profile-page/edit-landlord-profile-page.component';
import { LandlordAccommodationDetailComponent } from './landlord-accommodation-detail/landlord-accommodation-detail.component';
import { authGuard } from '../../core/guards/auth.guard'; // 👈 IMPORTAR GUARD
import { RoleType } from '../../core/models/user.model'; // 👈 IMPORTAR ROLES

const LANDLORD_ROLE = [RoleType.ROLE_PROPIETARIO];

export const landlordRoutes: Routes = [
  {
    path: 'dashboard',
    component: LandlordDashboardComponent,
    canActivate: [authGuard], // 👈 APLICAR GUARD
    data: { roles: LANDLORD_ROLE } // 👈 REQUERIR ROL
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
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
