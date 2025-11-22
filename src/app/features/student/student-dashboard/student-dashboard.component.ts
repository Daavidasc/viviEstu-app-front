import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StudentProfileViewModel, AccommodationCardViewModel } from '../../../core/models/ui-view.models';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { StudentService } from '../../../core/services/student.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, AccommodationCardComponent, FooterComponent, RouterModule, LoadingSpinnerComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: StudentProfileViewModel | null = null;

  allAccommodations: AccommodationCardViewModel[] = [];
  zoneRecommendations: AccommodationCardViewModel[] = [];
  uniRecommendations: AccommodationCardViewModel[] = [];

  isLoading = true;
  error: string | null = null;

  constructor(
    private accommodationService: AccommodationService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.studentService.getViewProfile().subscribe({
      next: (profile) => {
        this.currentUser = profile;
        this.accommodationService.getAllCards().subscribe({
          next: (data) => {
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
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading accommodations:', err);
            this.error = 'No se pudieron cargar los alojamientos.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error = 'No se pudo cargar la información del usuario.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleFavoriteToggle(item: AccommodationCardViewModel) {
    this.accommodationService.toggleFavorite(item.id);
    console.log(`Alojamiento ${item.id} favorito toggled`);
  }
}
