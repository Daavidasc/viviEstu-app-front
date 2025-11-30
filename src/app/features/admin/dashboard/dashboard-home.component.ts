import { Component, OnInit, signal } from '@angular/core';
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
    loading = signal(true);

    ngOnInit() {
        // Simulate loading for dashboard stats
        setTimeout(() => {
            this.loading.set(false);
        }, 1000);
    }
}
