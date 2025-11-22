import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccommodationDetailViewModel } from '../../../core/models/ui-view.models';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ComentarioResponse, ComentarioRequest } from '../../../core/models/interaction.models';
import { CommentsService } from '../../../core/services/comments.service';
import { StudentService } from '../../../core/services/student.service';

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
  accommodation: AccommodationDetailViewModel | null = null;
  comments: ComentarioResponse[] = [];
  newComment: string = '';
  isLoading = true;
  errorMessage = '';
  currentStudentId: number | null = null;
  isPostingComment = false;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentsService,
    private accommodationService: AccommodationService,
    private cdr: ChangeDetectorRef,
    private studentService: StudentService
  ) { }

  ngOnInit() {
    // Obtenemos el ID de la URL, lo convertimos a número y cargamos los datos
    const accommodationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAccommodationData(accommodationId);

    // Cargar ID del estudiante al iniciar
    this.studentService.getProfileId().subscribe({
      next: (id) => {
        this.currentStudentId = id;
        console.log('Student ID loaded:', this.currentStudentId);
      },
      error: (err) => console.error('Error loading student ID:', err)
    });
  }

  loadAccommodationData(id: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.accommodationService.getAccommodationDetail(id).subscribe({
      next: (data) => {
        this.accommodation = data;
        this.isLoading = false;
        this.cdr.detectChanges();
        // Cargar comentarios del alojamiento
        this.loadComments(id);
      },
      error: (err) => {
        console.error('Error al cargar detalles del alojamiento:', err);
        this.errorMessage = 'No se pudo cargar el alojamiento. Por favor, intenta de nuevo.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadComments(alojamientoId: number) {
    this.commentService.getCommentsByAccommodation(alojamientoId).subscribe({
      next: (data) => {
        this.comments = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
        // No mostramos error al usuario, simplemente no se muestran comentarios
      }
    });
  }

  getImageUrls(): string[] {
    return this.accommodation?.imagenes.map(img => img.url) || [];
  }

  toggleFavorite() {
    if (this.accommodation) {
      this.accommodation.isFavorite = !this.accommodation.isFavorite;
      this.accommodationService.toggleFavorite(this.accommodation.id);
      console.log('Favorito:', this.accommodation.isFavorite);
    }
  }

  postComment() {
    // Validar que exista el alojamiento, el contenido del comentario y el ID del estudiante
    if (!this.accommodation || !this.newComment.trim()) {
      return;
    }

    if (!this.currentStudentId) {
      alert('No se pudo identificar al usuario. Por favor recarga la página.');
      return;
    }

    this.isPostingComment = true;
    this.cdr.detectChanges();

    const newComment: ComentarioRequest = {
      contenido: this.newComment.trim(),
      estudianteId: this.currentStudentId,
      alojamientoId: this.accommodation.id
    };

    console.log('📝 Enviando comentario:', newComment);

    this.commentService.addComment(newComment).subscribe({
      next: (data) => {
        console.log('✅ Comentario enviado exitosamente:', data);
        this.comments.push(data);
        this.newComment = '';
        this.isPostingComment = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al enviar comentario:', err);
        alert('No se pudo enviar el comentario. Por favor, intenta de nuevo.');
        this.isPostingComment = false;
        this.cdr.detectChanges();
      }
    });
  }
}
