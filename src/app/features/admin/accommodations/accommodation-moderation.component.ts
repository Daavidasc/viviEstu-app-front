import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AlojamientoResponse } from '../../../core/models/accommodation.models';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';

@Component({
    selector: 'app-accommodation-moderation',
    standalone: true,
    imports: [CommonModule, AdminSidebarComponent, AdminTopbarComponent],
    templateUrl: './accommodation-moderation.component.html',
    styleUrls: ['./accommodation-moderation.component.css']
})
export class AccommodationModerationComponent implements OnInit {
    private adminService = inject(AdminService);

    accommodations = signal<AlojamientoResponse[]>([]);

    ngOnInit() {
        this.loadAccommodations();
    }

    loadAccommodations() {
        this.adminService.getAccommodations().subscribe({
            next: (data) => this.accommodations.set(data),
            error: (err) => console.error('Error loading accommodations', err)
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
}
