import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { RoleType } from '../../core/models/auth.models';
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
        path: 'dashboard',
        component: DashboardHomeComponent,
        canActivate: [adminGuard],
        data: { roles: ADMIN_ROLE }
    },
    {
        path: 'universities',
        component: UniversityListComponent,
        canActivate: [adminGuard],
        data: { roles: ADMIN_ROLE }
    },
    {
        path: 'districts',
        component: DistrictListComponent,
        canActivate: [adminGuard],
        data: { roles: ADMIN_ROLE }
    },
    {
        path: 'students',
        component: StudentListComponent,
        canActivate: [adminGuard],
        data: { roles: ADMIN_ROLE }
    },
    {
        path: 'landlords',
        component: LandlordListComponent,
        canActivate: [adminGuard],
        data: { roles: ADMIN_ROLE }
    },
    {
        path: 'accommodations',
        component: AccommodationModerationComponent,
        canActivate: [adminGuard],
        data: { roles: ADMIN_ROLE }
    },
    {
        path: 'comments',
        component: CommentModerationComponent,
        canActivate: [adminGuard],
        data: { roles: ADMIN_ROLE }
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }


];
