import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { LocationService } from '../../../core/services/location.service';
import { UniversidadResponse } from '../../../core/models/location.models';
import { UniversityFormComponent } from '../components/university-form/university-form.component';



import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';



@Component({
    selector: 'app-university-list',
    standalone: true,
    imports: [CommonModule, UniversityFormComponent, LoadingSpinnerComponent],
    templateUrl: './university-list.component.html',
    styleUrls: ['./university-list.component.css']
})
export class UniversityListComponent implements OnInit {
    private adminService = inject(AdminService);
    private locationService = inject(LocationService);

    universities = signal<UniversidadResponse[]>([]);
    loading = signal(false);
    showModal = false;
    selectedUniversity: UniversidadResponse | null = null;

    ngOnInit() {
        this.loadUniversities();
    }

    loadUniversities() {
        this.loading.set(true);
        this.locationService.getAllUniversities().subscribe({
            next: (data) => {
                this.universities.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading universities', err);
                this.loading.set(false);
            }
        });
    }

    openCreateModal() {
        this.selectedUniversity = null;
        this.showModal = true;
    }

    editUniversity(uni: UniversidadResponse) {
        this.selectedUniversity = uni;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.selectedUniversity = null;
    }

    onSaveUniversity(formData: any) {
        if (this.selectedUniversity) {
            // Update
            this.adminService.updateUniversity(this.selectedUniversity.id, formData).subscribe({
                next: () => {
                    this.loadUniversities();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating university', err)
            });
        } else {
            // Create
            this.adminService.createUniversity(formData).subscribe({
                next: () => {
                    this.loadUniversities();
                    this.closeModal();
                },
                error: (err) => console.error('Error creating university', err)
            });
        }
    }

    deleteUniversity(uni: UniversidadResponse) {
        if (confirm(`¿Estás seguro de eliminar la universidad ${uni.nombre}?`)) {
            this.adminService.deleteUniversity(uni.id).subscribe({
                next: () => this.loadUniversities(),
                error: (err) => console.error('Error deleting university', err)
            });
        }
    }
}
