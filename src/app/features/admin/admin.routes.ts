import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { RoleType } from '../../core/models/auth.models';
import { AdminComponent } from './admin.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home.component';
import { AccommodationModerationComponent } from './accommodations/accommodation-moderation.component';
import { UniversityListComponent } from './universities/university-list.component';
import { DistrictListComponent } from './districts/district-list.component';
import { StudentListComponent } from './students/student-list.component';
import { LandlordListComponent } from './landlords/landlord-list.component';
import { CommentModerationComponent } from './comments/comment-moderation.component';

const ADMIN_ROLE = [RoleType.ROLE_ADMIN];

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [adminGuard],
        data: { roles: ADMIN_ROLE },
        children: [
            {
                path: 'dashboard',
                component: DashboardHomeComponent
            },
            {
                path: 'universities',
                component: UniversityListComponent
            },
            {
                path: 'districts',
                component: DistrictListComponent
            },
            {
                path: 'students',
                component: StudentListComponent
            },
            {
                path: 'landlords',
                component: LandlordListComponent
            },
            {
                path: 'accommodations',
                component: AccommodationModerationComponent
            },
            {
                path: 'comments',
                component: CommentModerationComponent
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
