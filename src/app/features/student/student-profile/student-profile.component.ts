// src/app/student/pages/student-profile/student-profile.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
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

  constructor(
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.studentService.getViewProfile().subscribe(data => {
      this.student = data;
      this.cdr.detectChanges();
    });

    // 🚀 Llama al método de carga inicial de favoritos
    this.loadFavorites();

    this.studentService.getRequests().subscribe(data => {
      this.requests = data;
      this.cdr.detectChanges();
    });
  }

  // 🚀 NUEVO: Método para cargar favoritos, reutilizable
  loadFavorites() {
    this.studentService.getAllAccommodationsWithFavoriteStatus().subscribe(data => {
      // Filtra para mostrar solo los que son favoritos
      this.favorites = data.filter(item => item.isFavorite === true);
      this.cdr.detectChanges();
    }, error => {
      console.error('Error al cargar favoritos:', error);
      // Opcional: mostrar un mensaje de error al usuario
    });
  }

  // 🚀 NUEVO: Método para manejar el toggle de favoritos desde el AccommodationCardComponent
  handleFavoriteToggle(item: AccommodationCardViewModel) {
    // Llama al servicio para actualizar el estado en el backend
    this.studentService.toggleFavoriteStatus(item.id, item.isFavorite).subscribe({
      next: () => {
        // Invierte el estado localmente después de la confirmación del backend
        item.isFavorite = !item.isFavorite;

        // Si el ítem ya NO es favorito, lo eliminamos de la lista 'favorites'
        if (!item.isFavorite) {
          this.favorites = this.favorites.filter(fav => fav.id !== item.id);
        }
        // Si el ítem se convirtió en favorito, deberíamos añadirlo.
        // Pero en la vista de "Mi Perfil", solo cargamos los favoritos al inicio.
        // Si se añade un favorito desde otra vista, no aparecerá aquí automáticamente
        // a menos que volvamos a llamar a loadFavorites(), lo cual es más costoso.
        // Para esta vista, nos enfocamos en que desaparezca al desmarcar.

        this.cdr.detectChanges(); // Asegúrate de que Angular detecte los cambios
        console.log(`Alojamiento ${item.id} favorito toggled al estado: ${item.isFavorite}`);
      },
      error: (err) => {
        console.error('Error al cambiar el estado de favorito:', err);
        alert('Error: No se pudo actualizar el favorito en el servidor. Intenta de nuevo.');
        // Opcional: revertir el estado visual si la operación falla
      }
    });
  }
}
