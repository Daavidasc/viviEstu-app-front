
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
  isLoading = true;

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
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const accommodationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(accommodationId);
  }

  loadData(id: number) {
    this.isLoading = true;
    // Usamos forkJoin si quisiéramos esperar a ambos, pero por ahora lo manejamos simple
    // Cargamos datos del alojamiento
    this.accommodationService.getAccommodationDetail(id).subscribe({
      next: (data) => {
        this.accommodation = data;
        this.checkLoadingComplete();
      },
      error: () => {
        this.checkLoadingComplete();
      }
    });

    // Cargamos solicitudes
    this.landlordService.getRequestsByAccommodationId(id).subscribe({
      next: (data) => {
        this.requests = data;
        this.checkLoadingComplete();
      },
      error: () => {
        this.checkLoadingComplete();
      }
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

  acceptRequest(requestId: number) {
    const request = this.requests.find(r => r.requestId === requestId);
    const studentName = request?.title || 'el estudiante';
    
    this.landlordService.updateRequestStatus(requestId, 'ACEPTADO').subscribe({
      next: () => {
        // Update request status locally
        const req = this.requests.find(r => r.requestId === requestId);
        if (req) {
          req.status = 'ACEPTADO';
          req.statusColor = 'green';
        }
        
        // Show success notification
        this.showNotification(`Solicitud de ${studentName} aceptada exitosamente`, 'success');
      },
      error: (error) => {
        console.error('Error accepting request:', error);
        this.showNotification('Error al aceptar la solicitud. Intente nuevamente.', 'error');
      }
    });
  }

  rejectRequest(requestId: number) {
    const request = this.requests.find(r => r.requestId === requestId);
    const studentName = request?.title || 'el estudiante';
    
    this.landlordService.updateRequestStatus(requestId, 'RECHAZADO').subscribe({
      next: () => {
        // Remove request from the list
        this.requests = this.requests.filter(r => r.requestId !== requestId);
        
        // Show success notification
        this.showNotification(`Solicitud de ${studentName} rechazada`, 'success');
      },
      error: (error) => {
        console.error('Error rejecting request:', error);
        this.showNotification('Error al rechazar la solicitud. Intente nuevamente.', 'error');
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
