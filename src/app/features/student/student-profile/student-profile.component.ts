import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Componentes
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProfileInfoCardComponent } from '../components/profile-info-card/profile-info-card.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { RequestCardComponent } from '../components/request-card/request-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Servicios
import { StudentService } from '../../../core/services/student.service';
import { RequestService } from '../../../core/services/request.service';
import { InteractionService } from '../../../core/services/interaction.service';

// Modelos
import { StudentProfile } from '../../../core/models/student.models';
import { AccommodationCardViewModel } from '../../../core/models/accommodation.models';
import { RequestViewModel } from '../../../core/models/request.models';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StudentNavbarComponent,
    FooterComponent,
    ProfileInfoCardComponent,
    AccommodationCardComponent,
    RequestCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  student: StudentProfile | null = null; // Inicializamos en null
  favorites: AccommodationCardViewModel[] = [];
  requests: RequestViewModel[] = [];

  isLoadingProfile = true;
  isLoadingFavorites = true;
  isLoadingRequests = true;

  private studentService = inject(StudentService);
  private requestService = inject(RequestService);
  private interactionService = inject(InteractionService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadProfile();
    this.loadFavorites();
    this.loadRequests();
  }

  loadProfile() {
    this.isLoadingProfile = true;
    this.studentService.getProfile().subscribe({
      next: (data) => {
        console.log('Perfil cargado:', data);
        this.student = data;
        this.isLoadingProfile = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.isLoadingProfile = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFavorites() {
    // ... (Tu código actual de favoritos está bien, usando el nuevo servicio) ...
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

  loadRequests() {
    // ... (Tu código actual de requests está bien) ...
    this.studentService.getMyRequests().subscribe({
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

  // ... (Tus métodos handleCancelRequest y handleFavoriteToggle se mantienen igual) ...

  handleCancelRequest(requestId: number) {
    if (!confirm('¿Estás seguro de cancelar?')) return;
    this.requestService.cancelRequest(requestId).subscribe({
      next: () => {
        this.requests = this.requests.filter(req => req.requestId !== requestId);
        this.cdr.detectChanges();
      },
      error: (err) => alert('Error al cancelar')
    });
  }

  handleFavoriteToggle(item: AccommodationCardViewModel) {
    const studentId = this.student?.id;
    if(studentId) {
        const originalStatus = item.isFavorite;
        item.isFavorite = !item.isFavorite;
        this.interactionService.toggleFavorite(studentId, item.id, originalStatus).subscribe({
            next: () => {
                if(!item.isFavorite) this.favorites = this.favorites.filter(f => f.id !== item.id);
                this.cdr.detectChanges();
            },
            error: () => {
                item.isFavorite = originalStatus;
                this.cdr.detectChanges();
            }
        });
    }
  }
}
