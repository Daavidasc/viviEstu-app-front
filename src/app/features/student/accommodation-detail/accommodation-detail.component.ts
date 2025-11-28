import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Componentes
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Servicios
import { AccommodationService } from '../../../core/services/accommodation.service';
import { StudentService } from '../../../core/services/student.service';
import { InteractionService } from '../../../core/services/interaction.service'; // 👈 Servicio correcto

// Modelos
import {
  ComentarioResponse,
  ComentarioRequest
} from '../../../core/models/interaction.models'; // 👈 Agregado ComentarioRequest
import { AccommodationDetailViewModel } from '../../../core/models/accommodation.models';

@Component({
  selector: 'app-accommodation-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StudentNavbarComponent,
    FooterComponent,
    GalleryComponent,
    ContactFormComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './accommodation-detail.component.html',
  styleUrls: ['./accommodation-detail.component.css']
})
export class AccommodationDetailComponent implements OnInit {
  // Inyección de dependencias moderna (opcional, pero más limpia) o por constructor
  private route = inject(ActivatedRoute);
  private interactionService = inject(InteractionService); // 👈 Corregido nombre (camelCase)
  private accommodationService = inject(AccommodationService);
  private studentService = inject(StudentService);
  private cdr = inject(ChangeDetectorRef);

  accommodation: AccommodationDetailViewModel | null = null;
  comments: ComentarioResponse[] = [];
  newComment: string = '';
  isLoading = true;
  errorMessage = '';
  currentStudentId: number | null = null;
  isPostingComment = false;

  ngOnInit() {
    const accommodationId = Number(this.route.snapshot.paramMap.get('id'));

    // 1. Obtener ID del estudiante primero (necesario para favoritos y comentarios)
    this.studentService.getProfileId().subscribe({
      next: (id) => {
        this.currentStudentId = id;
        console.log('Student ID loaded:', this.currentStudentId);
        // 2. Cargar datos del alojamiento una vez tenemos el ID del estudiante
        this.loadAccommodationData(accommodationId);
      },
      error: (err) => {
        console.error('Error loading student ID:', err);
        // Aún intentamos cargar el alojamiento aunque falle el perfil (modo invitado quizás)
        this.loadAccommodationData(accommodationId);
      }
    });
  }

  loadAccommodationData(id: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.accommodationService.getAccommodationDetail(id).subscribe({
      next: (data) => {
        this.accommodation = data;

        // 💡 IMPORTANTE: Aquí deberías verificar si este alojamiento ya es favorito
        // para inicializar el booleano `isFavorite`.
        // Si tu backend no devuelve ese dato en el detalle, tendrías que
        // consultar la lista de favoritos del estudiante y cruzar datos.
        if (this.currentStudentId) {
             this.checkIfFavorite(id);
        }

        this.isLoading = false;
        this.loadComments(id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar detalles:', err);
        this.errorMessage = 'No se pudo cargar el alojamiento.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método auxiliar para verificar estado inicial de favorito
  checkIfFavorite(accommodationId: number) {
      this.studentService.getFavorites().subscribe(favorites => {
          if (this.accommodation) {
              const isFav = favorites.some(f => f.alojamientoId === accommodationId);
              this.accommodation.isFavorite = isFav;
          }
      });
  }

  loadComments(alojamientoId: number) {
    // Usamos interactionService, no commentService
    this.interactionService.getCommentsByAccommodation(alojamientoId).subscribe({
      next: (data) => {
        this.comments = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar comentarios:', err)
    });
  }

  getImageUrls(): string[] {
    // Protección contra undefined
    return this.accommodation?.imagenes?.map(img => img.url) || [];
  }

  toggleFavorite() {
    if (!this.accommodation || !this.currentStudentId) {
        alert('Debes iniciar sesión para guardar favoritos.');
        return;
    }

    // Estado actual antes del cambio
    const currentStatus = this.accommodation.isFavorite || false;

    // Actualización optimista en UI (inmediata)
    this.accommodation.isFavorite = !currentStatus;

    // Llamada al servicio correcto
    this.interactionService.toggleFavorite(this.currentStudentId, this.accommodation.id, currentStatus)
        .subscribe({
            next: () => console.log('Favorito actualizado exitosamente'),
            error: (err) => {
                console.error('Error actualizando favorito', err);
                // Revertir cambio en caso de error
                if (this.accommodation) {
                    this.accommodation.isFavorite = currentStatus;
                    this.cdr.detectChanges();
                }
                alert('No se pudo actualizar favoritos.');
            }
        });
  }

  postComment() {
    if (!this.accommodation || !this.newComment.trim()) return;

    if (!this.currentStudentId) {
      alert('No se pudo identificar al usuario. Por favor recarga la página.');
      return;
    }

    this.isPostingComment = true;

    const newCommentData: ComentarioRequest = {
      contenido: this.newComment.trim(),
      estudianteId: this.currentStudentId,
      alojamientoId: this.accommodation.id
    };

    // Usamos interactionService
    this.interactionService.addComment(newCommentData).subscribe({
      next: (data) => {
        console.log('✅ Comentario enviado:', data);
        this.comments.push(data);
        this.newComment = '';
        this.isPostingComment = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al enviar comentario:', err);
        alert('No se pudo enviar el comentario.');
        this.isPostingComment = false;
        this.cdr.detectChanges();
      }
    });
  }
}
