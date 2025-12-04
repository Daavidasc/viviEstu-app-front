import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GalleryComponent } from '../../student/components/gallery/gallery.component';
import { AccommodationRequestsListComponent } from '../components/accommodation-requests-list/accommodation-requests-list.component';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LandlordService } from '../../../core/services/landlord.service';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AccommodationDetailViewModel } from '../../../core/models/accommodation.models';
import { RequestViewModel } from '../../../core/models/request.models';
import { InteractionService } from '../../../core/services/interaction.service';
import { ComentarioResponse } from '../../../core/models/interaction.models';

@Component({
  selector: 'app-landlord-accommodation-detail',
  standalone: true,
  imports: [FormsModule, RouterModule, LandlordNavbarComponent, FooterComponent, GalleryComponent, AccommodationRequestsListComponent, LoadingSpinnerComponent, CommonModule],
  templateUrl: './landlord-accommodation-detail.component.html',
  styleUrls: ['./landlord-accommodation-detail.component.css']
})
export class LandlordAccommodationDetailComponent implements OnInit {
  accommodation: AccommodationDetailViewModel | null = null;
  requests: RequestViewModel[] = [];
  comments: ComentarioResponse[] = [];
  isLoading = true;
  isEditing = false;

  // Notification system
  notification: { message: string; type: 'success' | 'error'; show: boolean } = {
    message: '',
    type: 'success',
    show: false
  };

  constructor(
    private route: ActivatedRoute,
    private accommodationService: AccommodationService,
    private landlordService: LandlordService,
    private interactionService: InteractionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const accommodationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(accommodationId);
  }

  loadData(id: number) {
    this.isLoading = true;
    this.accommodationService.getAccommodationDetail(id).subscribe({
      next: (data) => {
        this.accommodation = data;
        this.checkLoadingComplete();
      },
      error: () => {
        this.checkLoadingComplete();
      }
    });

    this.landlordService.getRequestsByAccommodationId(id).subscribe({
      next: (data) => {
        this.requests = data;
        this.checkLoadingComplete();
      },
      error: () => {
        this.checkLoadingComplete();
      }
    });

    this.loadComments(id);
  }

  loadComments(alojamientoId: number) {
    this.interactionService.getCommentsByAccommodation(alojamientoId).subscribe({
      next: (data) => {
        this.comments = data;
        // No need to check loading complete for comments as it's not critical for page display
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar comentarios:', err)
    });
  }

  private loadedCount = 0;
  private checkLoadingComplete() {
    this.loadedCount++;
    if (this.loadedCount >= 2) {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  getImageUrls(): string[] {
    return this.accommodation?.imagenes?.map(img => img.url) || [];
  }

  onAccommodationUpdated() {
    this.isEditing = false;
    if (this.accommodation) {
      this.loadData(this.accommodation.id);
      this.showNotification('Alojamiento actualizado correctamente', 'success');
    }
  }

  acceptRequest(requestId: number) {
    this.landlordService.updateRequestStatus(requestId, 'ACEPTADO').subscribe({
      next: () => {
        setTimeout(() => {
          // 1. Lógica de actualización
          const req = this.requests.find(r => r.requestId === requestId);
          if (req) {
            req.status = 'ACEPTADO';
            req.statusColor = 'green';
          }
          this.requests = [...this.requests];

          // 2. Notificación
          this.showNotification(`Solicitud aceptada exitosamente`, 'success');

          // 3. 🔥 EL FIX: Forzar la detección de cambios AQUÍ
          this.cdr.detectChanges();

        }, 0);
      },
      error: (error) => {
        console.error('Error al aceptar:', error);
        this.showNotification('Error al procesar la solicitud.', 'error');
      }
    });
  }

  rejectRequest(requestId: number) {
    const request = this.requests.find(r => r.requestId === requestId);
    const studentName = request?.title || 'el estudiante';

    this.landlordService.updateRequestStatus(requestId, 'RECHAZADO').subscribe({
      next: () => {
        setTimeout(() => {

          // 1. MODIFICADO: En lugar de filtrar (borrar), buscamos y actualizamos
          const req = this.requests.find(r => r.requestId === requestId);

          if (req) {
            req.status = 'RECHAZADO';
            req.statusColor = 'red'; // Esto hará que se vea roja la etiqueta
          }

          // Refrescamos la referencia del array para que Angular detecte el cambio en el item
          this.requests = [...this.requests];

          // 2. Notificación
          this.showNotification(`Solicitud de ${studentName} rechazada`, 'success');

          // 3. Forzar detección de cambios
          this.cdr.detectChanges();

        }, 0);
      },
      error: (error) => {
        console.error('Error rejecting request:', error);
        this.showNotification('Error al rechazar la solicitud.', 'error');
      }
    });
  }

  markAsRented() {
    if (!this.accommodation) return;

    if (!confirm('¿Estás seguro de que deseas marcar este alojamiento como alquilado?\n\n⚠️ IMPORTANTE: Esta acción no se puede deshacer por 30 días y ocultará el alojamiento de las búsquedas.')) {
      return;
    }

    this.landlordService.rentAccommodation(this.accommodation.id).subscribe({
      next: () => {
        this.showNotification('Alojamiento marcado como alquilado exitosamente.', 'success');
        // Opcional: Recargar datos o redirigir
        // this.loadData(this.accommodation!.id);
      },
      error: (err) => {
        console.error('Error marking as rented:', err);
        this.showNotification('Error al marcar como alquilado.', 'error');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.notification = { message, type, show: true };

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  }

  closeNotification() {
    this.notification.show = false;
  }
}
