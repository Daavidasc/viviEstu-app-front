import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProfileInfoCardComponent } from '../components/profile-info-card/profile-info-card.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { RequestCardComponent } from '../components/request-card/request-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AccommodationCardViewModel, StudentRequestViewModel, StudentProfileViewModel } from '../../../core/models/ui-view.models';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, ProfileInfoCardComponent, AccommodationCardComponent, RequestCardComponent, LoadingSpinnerComponent],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  student!: StudentProfileViewModel;
  favorites: AccommodationCardViewModel[] = [];
  requests: StudentRequestViewModel[] = [];

  isLoadingProfile = true;
  isLoadingFavorites = true;
  isLoadingRequests = true;

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.studentService.getViewProfile().subscribe({
      next: (data) => {
        this.student = data;
        this.isLoadingProfile = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingProfile = false;
        this.cdr.detectChanges();
      }
    });

    this.loadFavorites();

    this.studentService.getRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoadingRequests = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingRequests = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFavorites() {
    this.isLoadingFavorites = true;
    this.studentService.getAllAccommodationsWithFavoriteStatus().subscribe({
      next: (data) => {
        this.favorites = data.filter(item => item.isFavorite === true);
        this.isLoadingFavorites = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar favoritos:', error);
        this.isLoadingFavorites = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleFavoriteToggle(item: AccommodationCardViewModel) {
    this.studentService.toggleFavoriteStatus(item.id, item.isFavorite).subscribe({
      next: () => {
        item.isFavorite = !item.isFavorite;
        if (!item.isFavorite) {
          this.favorites = this.favorites.filter(fav => fav.id !== item.id);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cambiar el estado de favorito:', err);
        alert('Error: No se pudo actualizar el favorito en el servidor. Intenta de nuevo.');
      }
    });
  }
}
