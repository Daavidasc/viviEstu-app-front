import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { LandlordResponse } from '../../../core/models/user.models';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';

@Component({
    selector: 'app-landlord-list',
    standalone: true,
    imports: [CommonModule, AdminSidebarComponent, AdminTopbarComponent],
    templateUrl: './landlord-list.component.html',
    styleUrls: ['./landlord-list.component.css']
})
export class LandlordListComponent implements OnInit {
    private adminService = inject(AdminService);

    landlords = signal<LandlordResponse[]>([]);

    ngOnInit() {
        this.loadLandlords();
    }

    loadLandlords() {
        this.adminService.getLandlords().subscribe({
            next: (data) => this.landlords.set(data),
            error: (err) => console.error('Error loading landlords', err)
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
