import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Componentes
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Servicios
import { AccommodationService } from '../../../core/services/accommodation.service';
import { StudentService } from '../../../core/services/student.service';
import { InteractionService } from '../../../core/services/interaction.service';

// Modelos
import { StudentProfile } from '../../../core/models/student.models'; // 👈 Asegúrate de esta ruta
import { AccommodationCardViewModel } from '../../../core/models/accommodation.models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StudentNavbarComponent,
    AccommodationCardComponent,
    FooterComponent,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  private accommodationService = inject(AccommodationService);
  private studentService = inject(StudentService);
  private interactionService = inject(InteractionService);
  private cdr = inject(ChangeDetectorRef);

  currentUser: StudentProfile | null = null;

  allAccommodations: AccommodationCardViewModel[] = [];
  zoneRecommendations: AccommodationCardViewModel[] = [];
  uniRecommendations: AccommodationCardViewModel[] = [];

  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    // 1. Obtener Perfil
    this.studentService.getProfile().subscribe({
      next: (profile) => {
        this.currentUser = profile;

        // 2. Obtener Alojamientos
        this.studentService.getAllAccommodationsWithFavoriteStatus().subscribe({
          next: (data) => {
            this.allAccommodations = data;

            // 💡 CORRECCIÓN CLAVE: Capturamos el usuario en una constante local
            const user = this.currentUser;

            if (user) {
              // Validamos que user.district exista antes de filtrar
              const userDistrict = user.distrito; // Fallback por si acaso

              if (userDistrict) {
                this.zoneRecommendations = this.allAccommodations
                  .filter(item =>
                     item.district?.toLowerCase() === userDistrict.toLowerCase()
                  )
                  .slice(0, 3);
              }

              // Validamos que user.university exista antes de filtrar
              const userUni = user.universidad; // Fallback por si acaso

              if (userUni) {
                  this.uniRecommendations = this.allAccommodations
                    .filter(item =>
                        item.universityNear?.toLowerCase() === userUni.toLowerCase()
                    )
                    .slice(0, 3);
              }
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
        this.error = 'No se pudo cargar tu perfil.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleFavoriteToggle(item: AccommodationCardViewModel) {
    const studentId = this.currentUser?.id;

    if (!studentId) {
        alert('Error: No se ha identificado al usuario.');
        return;
    }

    const originalStatus = item.isFavorite;
    item.isFavorite = !item.isFavorite; // Optimista

    this.interactionService.toggleFavorite(studentId, item.id, originalStatus).subscribe({
      next: () => console.log(`Favorito actualizado para alojamiento ${item.id}`),
      error: (err) => {
        console.error('Error al cambiar favorito:', err);
        item.isFavorite = originalStatus; // Revertir
        alert('No se pudo guardar el favorito.');
        this.cdr.detectChanges();
      }
    });
  }
}
