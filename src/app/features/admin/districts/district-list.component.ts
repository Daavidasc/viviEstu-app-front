import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { LocationService } from '../../../core/services/location.service';
import { DistrictFormComponent } from '../components/district-form/district-form.component';
import { DistritoResponse } from '../../../core/models/location.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-district-list',
    standalone: true,
    imports: [CommonModule, DistrictFormComponent, LoadingSpinnerComponent],
    templateUrl: './district-list.component.html',
    styleUrls: ['./district-list.component.css']
})
export class DistrictListComponent implements OnInit {
    private locationService = inject(LocationService);
    private adminService = inject(AdminService);
    private router = inject(Router);

    districts = signal<DistritoResponse[]>([]);
    loading = signal(false);
    showModal = false;
    selectedDistrict: DistritoResponse | null = null;

    ngOnInit() {
        this.loadDistricts();
    }

    loadDistricts() {
        this.loading.set(true);
        this.locationService.getAllDistricts().subscribe({
            next: (data) => {
                this.districts.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading districts', err);
                this.loading.set(false);
            }
        });
    }

    openCreateModal() {
        this.selectedDistrict = null;
        this.showModal = true;
    }

    editDistrict(dist: DistritoResponse) {
        this.selectedDistrict = dist;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.selectedDistrict = null;
    }

    onSaveDistrict(formData: any) {
        if (this.selectedDistrict) {
            // Update
            this.adminService.updateDistrict(this.selectedDistrict.id, formData).subscribe({
                next: () => {
                    this.loadDistricts();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating district', err)
            });
        } else {
            // Create
            this.adminService.createDistrict(formData).subscribe({
                next: () => {
                    this.loadDistricts();
                    this.closeModal();
                },
                error: (err) => console.error('Error creating district', err)
            });
        }
    }

    deleteDistrict(dist: DistritoResponse) {
        if (confirm(`¿Estás seguro de eliminar el distrito ${dist.nombre}?`)) {
            this.adminService.deleteDistrict(dist.id).subscribe({
                next: () => this.loadDistricts(),
                error: (err) => console.error('Error deleting district', err)
            });
        }
    }

    viewDistrict(dist: DistritoResponse) {
        this.router.navigate(['/student/districts', dist.id]);
    }
}
