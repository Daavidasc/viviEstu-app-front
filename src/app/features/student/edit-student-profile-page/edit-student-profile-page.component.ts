import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EditStudentProfileFormComponent } from '../components/edit-student-profile-form/edit-student-profile-form.component';
import { StudentProfileViewModel } from '../../../core/models/ui-view.models';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-edit-student-profile-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, EditStudentProfileFormComponent],
  templateUrl: './edit-student-profile-page.component.html',
  styleUrls: ['./edit-student-profile-page.component.css']
})
export class EditStudentProfilePageComponent implements OnInit {
  student!: StudentProfileViewModel;

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { studentData: StudentProfileViewModel };
    if (state?.studentData) {
      this.student = state.studentData;
    }
  }

  ngOnInit(): void {
    // Si el estudiante no fue pasado por el state (ej. recarga de página)
    if (!this.student) {
      this.studentService.getViewProfile().subscribe(data => {
        this.student = data;
      });
    }
  }
}
