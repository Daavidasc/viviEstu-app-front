import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [AdminSidebarComponent, AdminTopbarComponent],
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent { }
