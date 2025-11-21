import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { StudentProfileViewModel, AccommodationCardViewModel } from '../../../core/models/ui-view.models';
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
  currentUser: StudentProfileViewModel | null = null;

  allAccommodations: AccommodationCardViewModel[] = [];
  zoneRecommendations: AccommodationCardViewModel[] = [];
  uniRecommendations: AccommodationCardViewModel[] = [];

  constructor(
    private accommodationService: AccommodationService,
    private studentService: StudentService
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.studentService.getProfile().subscribe(profile => {
      this.currentUser = profile;

      this.accommodationService.getAllCards().subscribe(data => {
        this.allAccommodations = data;

        if (this.currentUser) {
          this.zoneRecommendations = this.allAccommodations
            .filter(item => item.district === this.currentUser!.district)
            .slice(0, 3);

          // Filter by universityNear field if available
          this.uniRecommendations = this.allAccommodations
            .filter(item => item.universityNear === this.currentUser!.university)
            .slice(0, 3);
        }
      });
    });
  }

  handleFavoriteToggle(item: AccommodationCardViewModel) {
    this.accommodationService.toggleFavorite(item.id);
    console.log(`Alojamiento ${item.id} favorito toggled`);
  }
}
