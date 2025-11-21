import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { AccommodationDetailComponent } from './accommodation-detail/accommodation-detail.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { DistrictsPageComponent } from './districts-page/districts-page.component';
import { ComparePageComponent } from './compare-page/compare-page.component';
import { EditStudentProfilePageComponent } from './edit-student-profile-page/edit-student-profile-page.component';
import { AccommodationsPageComponent } from './accommodations-page/accommodations-page.component';
import { DistrictDetailPageComponent } from './district-detail-page/district-detail-page.component';


export const studentRoutes: Routes = [
  {
    path: 'dashboard',
    component: StudentDashboardComponent
  },
  {
    path: 'accommodations',
    component: AccommodationsPageComponent
  },
  {
    path: 'accommodations/:id',
    component: AccommodationDetailComponent
  },
  {
    path: 'profile',
    component: StudentProfileComponent
  },
  {

    path: 'profile/edit',
    component: EditStudentProfilePageComponent
  },
  {
    path: 'districts',
    component: DistrictsPageComponent
  },
  {
    path: 'districts/:id',
    component: DistrictDetailPageComponent
  },
  {
    path: 'compare',
    component: ComparePageComponent
  },
  {

    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
