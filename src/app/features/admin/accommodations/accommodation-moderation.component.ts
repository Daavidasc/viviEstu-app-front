import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AlojamientoResponse } from '../../../core/models/accommodation.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-accommodation-moderation',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    templateUrl: './accommodation-moderation.component.html',
    styleUrls: ['./accommodation-moderation.component.css']
})
export class AccommodationModerationComponent implements OnInit {
    private adminService = inject(AdminService);
    private router = inject(Router);

    accommodations = signal<AlojamientoResponse[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadAccommodations();
    }

    loadAccommodations() {
        this.loading.set(true);
        this.adminService.getAccommodations().subscribe({
            next: (data) => {
                this.accommodations.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading accommodations', err);
                this.loading.set(false);
            }
        });
    }

    toggleStatus(acc: AlojamientoResponse) {
        const newStatus = acc.alquilado ? 'liberar' : 'alquilar';
        const confirmMsg = acc.alquilado
            ? `¿Marcar "${acc.titulo}" como DISPONIBLE?`
            : `¿Marcar "${acc.titulo}" como ALQUILADO?`;

        if (confirm(confirmMsg)) {
            this.adminService.updateAccommodationStatus(acc.id, newStatus).subscribe({
                next: () => this.loadAccommodations(),
                error: (err) => console.error('Error updating status', err)
            });
        }
    }

    deleteAccommodation(acc: AlojamientoResponse) {
        if (confirm(`¿Estás seguro de eliminar el alojamiento "${acc.titulo}"?`)) {
            this.adminService.deleteAccommodation(acc.id).subscribe({
                next: () => this.loadAccommodations(),
                error: (err) => console.error('Error deleting accommodation', err)
            });
        }
    }

    viewAccommodation(acc: AlojamientoResponse) {
        this.router.navigate(['/student/accommodations', acc.id]);
    }
}
