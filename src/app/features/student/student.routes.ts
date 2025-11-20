import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { AccommodationDetailComponent } from './accommodation-detail/accommodation-detail.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { DistrictsPageComponent } from './districts-page/districts-page.component';
import { ComparePageComponent } from './compare-page/compare-page.component';

export const studentRoutes: Routes = [
  {
    path: 'dashboard',
    component: StudentDashboardComponent
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
    path: 'districts',
    component: DistrictsPageComponent
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
