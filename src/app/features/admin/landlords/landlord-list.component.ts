import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { LandlordResponse } from '../../../core/models/user.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-landlord-list',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    templateUrl: './landlord-list.component.html',
    styleUrls: ['./landlord-list.component.css']
})
export class LandlordListComponent implements OnInit {
    private adminService = inject(AdminService);

    landlords = signal<LandlordResponse[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadLandlords();
    }

    loadLandlords() {
        this.loading.set(true);
        this.adminService.getLandlords().subscribe({
            next: (data) => {
                this.landlords.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading landlords', err);
                this.loading.set(false);
            }
        });
    }

    deleteLandlord(landlord: LandlordResponse) {
        if (confirm(`¿Estás seguro de eliminar al arrendador ${landlord.nombre} ${landlord.apellidos}?`)) {
            this.adminService.deleteLandlord(landlord.id).subscribe({
                next: () => this.loadLandlords(),
                error: (err) => console.error('Error deleting landlord', err)
            });
        }
    }
}
