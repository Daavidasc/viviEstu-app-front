import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { UserProfile, Accommodation } from '../../../core/models/student.models';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, AccommodationCardComponent, FooterComponent, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: UserProfile | null = null;

  allAccommodations: Accommodation[] = [];
  zoneRecommendations: Accommodation[] = [];
  uniRecommendations: Accommodation[] = [];

  constructor(
    private accommodationService: AccommodationService,
    private studentService: StudentService
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.studentService.getProfile().subscribe(profile => {
      this.currentUser = {
        id: profile.id || 0,
        name: profile.name || '',
        university: profile.university,
        preferredDistrict: profile.preferredDistrict || '',
        avatarUrl: profile.avatarUrl || ''
      };

      this.accommodationService.getAccommodations().subscribe(data => {
        this.allAccommodations = data;

        if (this.currentUser) {
          this.zoneRecommendations = this.allAccommodations
            .filter(item => item.district === this.currentUser!.preferredDistrict)
            .slice(0, 3);

          this.uniRecommendations = this.allAccommodations
            .filter(item => item.universityNear === this.currentUser!.university)
            .slice(0, 3);
        }
      });
    });
  }

  handleFavoriteToggle(item: Accommodation) {
    this.accommodationService.toggleFavorite(item.id);
    console.log(`Alojamiento ${item.id} favorito toggled`);
  }
}
