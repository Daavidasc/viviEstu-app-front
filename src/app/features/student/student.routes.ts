import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { AccommodationDetailComponent } from './accommodation-detail/accommodation-detail.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';


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
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
