import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { StudentResponse } from '../../../core/models/user.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
    private adminService = inject(AdminService);

    students = signal<StudentResponse[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadStudents();
    }

    loadStudents() {
        this.loading.set(true);
        this.adminService.getStudents().subscribe({
            next: (data) => {
                this.students.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading students', err);
                this.loading.set(false);
            }
        });
    }

    banStudent(student: StudentResponse) {
        if (confirm(`¿Estás seguro de eliminar/banear al estudiante ${student.nombre} ${student.apellidos}?`)) {
            this.adminService.banStudent(student.id).subscribe({
                next: () => this.loadStudents(),
                error: (err) => console.error('Error banning student', err)
            });
        }
    }
}
