import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer';
import { ProfileInfoCardComponent } from '../components/profile-info-card/profile-info-card.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { RequestCardComponent } from '../components/request-card/request-card.component';
import { AccommodationCardViewModel, StudentRequestViewModel, StudentProfileViewModel } from '../../../core/models/ui-view.models';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, ProfileInfoCardComponent, AccommodationCardComponent, RequestCardComponent],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  student!: StudentProfileViewModel;
  favorites: AccommodationCardViewModel[] = [];
  requests: StudentRequestViewModel[] = [];

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
