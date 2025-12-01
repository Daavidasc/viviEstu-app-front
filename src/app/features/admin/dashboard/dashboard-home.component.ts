import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { AdminStats } from '../../../core/models/admin.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
    private adminService = inject(AdminService);

    loading = signal(true);
    stats = signal<AdminStats | null>(null);

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.loading.set(true);
        this.adminService.getDashboardStats().subscribe({
            next: (data) => {
                this.stats.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading stats', err);
                this.loading.set(false);
            }
        });
    }
}
