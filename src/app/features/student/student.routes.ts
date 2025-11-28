import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { AccommodationDetailComponent } from './accommodation-detail/accommodation-detail.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { DistrictsPageComponent } from './districts-page/districts-page.component';
import { ComparePageComponent } from './compare-page/compare-page.component';
import { EditStudentProfilePageComponent } from './edit-student-profile-page/edit-student-profile-page.component';
import { AccommodationsPageComponent } from './accommodations-page/accommodations-page.component';
import { DistrictDetailPageComponent } from './district-detail-page/district-detail-page.component';
import { authGuard } from '../../core/guards/auth.guard'; // 👈 IMPORTAR GUARD
import { RoleType } from '../../core/models/auth.models'; // 👈 IMPORTAR ROLES

const STUDENT_ROLE = [RoleType.ROLE_ESTUDIANTE];

export const studentRoutes: Routes = [
  {
    path: 'dashboard',
    component: StudentDashboardComponent,
    canActivate: [authGuard], // 👈 APLICAR GUARD
    data: { roles: STUDENT_ROLE } // 👈 REQUERIR ROL
  },
  {
    path: 'accommodations',
    component: AccommodationsPageComponent,
    canActivate: [authGuard],
    data: { roles: STUDENT_ROLE }
  },
  {
    path: 'accommodations/:id',
    component: AccommodationDetailComponent,
    canActivate: [authGuard],
    data: { roles: STUDENT_ROLE }
  },
  {
    path: 'profile',
    component: StudentProfileComponent,
    canActivate: [authGuard],
    data: { roles: STUDENT_ROLE }
  },
  {
    path: 'profile/edit',
    component: EditStudentProfilePageComponent,
    canActivate: [authGuard],
    data: { roles: STUDENT_ROLE }
  },
  {
    path: 'districts',
    component: DistrictsPageComponent,
    canActivate: [authGuard],
    data: { roles: STUDENT_ROLE }
  },
  {
    path: 'districts/:id',
    component: DistrictDetailPageComponent,
    canActivate: [authGuard],
    data: { roles: STUDENT_ROLE }
  },
  {
    path: 'compare',
    component: ComparePageComponent,
    canActivate: [authGuard],
    data: { roles: STUDENT_ROLE }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
