import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { StudentResponse } from '../../../core/models/user.models';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [CommonModule, AdminSidebarComponent, AdminTopbarComponent],
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
    private adminService = inject(AdminService);

    students = signal<StudentResponse[]>([]);

    ngOnInit() {
        this.loadStudents();
    }

    loadStudents() {
        this.adminService.getStudents().subscribe({
            next: (data) => this.students.set(data),
            error: (err) => console.error('Error loading students', err)
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
