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
  newComment: string = '';
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private accommodationService: AccommodationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Obtenemos el ID de la URL, lo convertimos a número y cargamos los datos
    const accommodationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAccommodationData(accommodationId);
  }

  loadAccommodationData(id: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.accommodationService.getAccommodationDetail(id).subscribe({
      next: (data) => {
        this.accommodation = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar detalles del alojamiento:', err);
        this.errorMessage = 'No se pudo cargar el alojamiento. Por favor, intenta de nuevo.';
        this.isLoading = false;
        this.cdr.detectChanges();
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
    if (this.newComment.trim()) {
      console.log('Enviando comentario:', this.newComment);
      this.newComment = '';
      alert('¡Comentario enviado!');
    }
  }
}
