import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProfileInfoCardComponent } from '../components/profile-info-card/profile-info-card.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component'; // Importación cambiada
import { RequestCardComponent } from '../components/request-card/request-card.component';
import { StudentProfile, Accommodation, ActiveRequest } from '../../../core/models/student.models';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, ProfileInfoCardComponent, AccommodationCardComponent, RequestCardComponent], // Componente cambiado
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  student!: StudentProfile;
  favorites: Accommodation[] = [];
  requests: ActiveRequest[] = [];

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    this.studentService.getProfile().subscribe(data => {
      this.student = data;
    });

    this.studentService.getFavorites().subscribe(data => {
      this.favorites = data;
    });

    this.studentService.getRequests().subscribe(data => {
      this.requests = data;
    });
  }
}
