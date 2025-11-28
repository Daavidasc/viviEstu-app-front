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
import { InteractionService } from '../../../core/services/interaction.service'; // 👈 1. IMPORTAR

// Modelos
import { StudentProfileViewModel } from '../../../core/models/student.models';
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
  // Estado
  student!: StudentProfileViewModel;
  favorites: AccommodationCardViewModel[] = [];
  requests: RequestViewModel[] = [];

  isLoadingProfile = true;
  isLoadingFavorites = true;
  isLoadingRequests = true;

  // Inyección de dependencias (Estilo moderno con inject)
  private studentService = inject(StudentService);
  private requestService = inject(RequestService);
  private interactionService = inject(InteractionService); // 👈 2. INYECTAR
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadProfile();
    this.loadFavorites();
    this.loadRequests();
  }

  loadProfile() {
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
  }

  loadFavorites() {
    this.isLoadingFavorites = true;
    this.studentService.getAllAccommodationsWithFavoriteStatus().subscribe({
      next: (data) => {
        // Filtramos solo los que tienen isFavorite = true
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

  handleCancelRequest(requestId: number) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      return;
    }

    this.requestService.cancelRequest(requestId).subscribe({
      next: () => {
        this.requests = this.requests.filter(req => req.requestId !== requestId);
        this.cdr.detectChanges();
        alert('Solicitud cancelada exitosamente.');
      },
      error: (err) => {
        console.error('Error al cancelar la solicitud:', err);
        alert('No se pudo cancelar la solicitud. Por favor, intenta de nuevo.');
      }
    });
  }

  // 👈 3. LÓGICA COMPLETA DE FAVORITOS
  handleFavoriteToggle(item: AccommodationCardViewModel) {
    const studentId = this.student?.id;

    if (studentId) {
      // Guardamos el estado original por si falla la petición
      const originalStatus = item.isFavorite;

      // Actualización optimista: Cambiamos la UI inmediatamente
      item.isFavorite = !item.isFavorite;

      // Llamamos al servicio
      this.interactionService.toggleFavorite(studentId, item.id, originalStatus).subscribe({
        next: () => {
          console.log('Favorito actualizado correctamente');

          // Si estamos en la pestaña de favoritos y el usuario quitó el like,
          // eliminamos la tarjeta de la lista visualmente.
          if (!item.isFavorite) {
            this.favorites = this.favorites.filter(fav => fav.id !== item.id);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al actualizar favorito:', err);

          // Revertimos el cambio visual si hubo error
          item.isFavorite = originalStatus;
          // Si lo habíamos sacado de la lista (visualmente), tendríamos que recargar,
          // pero como el filtro es en memoria, simplemente revertimos el booleano.
          alert('No se pudo actualizar el favorito. Intenta de nuevo.');
          this.cdr.detectChanges();
        }
      });
    } else {
      console.error('No se pudo obtener el ID del estudiante para gestionar favoritos.');
    }
  }
}
