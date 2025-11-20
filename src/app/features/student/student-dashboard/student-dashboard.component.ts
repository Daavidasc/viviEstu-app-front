import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { UserProfile, Accommodation } from '../../../core/models/student.models';
import { AccommodationService } from '../../../core/services/accommodation.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, AccommodationCardComponent, FooterComponent, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: UserProfile = {
    id: 101,
    name: 'Henry',
    university: 'UPC Monterrico',
    preferredDistrict: 'Monterrico',
    avatarUrl: 'assets/avatar.png'
  };

  allAccommodations: Accommodation[] = [];
  zoneRecommendations: Accommodation[] = [];
  uniRecommendations: Accommodation[] = [];

  constructor(private accommodationService: AccommodationService) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.accommodationService.getAccommodations().subscribe(data => {
      this.allAccommodations = data;

      this.zoneRecommendations = this.allAccommodations
        .filter(item => item.district === this.currentUser.preferredDistrict)
        .slice(0, 3);

      this.uniRecommendations = this.allAccommodations
        .filter(item => item.universityNear === this.currentUser.university)
        .slice(0, 3);
    });
  }

  handleFavoriteToggle(item: Accommodation) {
    this.accommodationService.toggleFavorite(item.id);
    // Refresh data to update UI if needed, or just rely on local state update in service if observable was a behavior subject
    // For now, we just toggle in service. In a real app with backend, we would call API.
    console.log(`Alojamiento ${item.id} favorito toggled`);
  }
}
