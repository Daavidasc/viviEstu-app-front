import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GalleryComponent } from '../../student/components/gallery/gallery.component';
import { AccommodationRequestsListComponent } from '../components/accommodation-requests-list/accommodation-requests-list.component';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LandlordService } from '../../../core/services/landlord.service';
import { AccommodationDetailViewModel, LandlordRequestViewModel } from '../../../core/models/ui-view.models';
import { CommonModule } from '@angular/common';
//import { EstadoSolicitud } from '../../../core/models/interaction.models.ts'
@Component({
  selector: 'app-landlord-accommodation-detail',
  standalone: true,
  imports: [FormsModule, RouterModule, LandlordNavbarComponent, FooterComponent, GalleryComponent, AccommodationRequestsListComponent, CommonModule],
  templateUrl: './landlord-accommodation-detail.component.html',
  styleUrls: ['./landlord-accommodation-detail.component.css']
})


export class LandlordAccommodationDetailComponent implements OnInit {
  accommodation: AccommodationDetailViewModel | null = null;
  requests: LandlordRequestViewModel[] = [];
  
  // Notification system
  notification: { message: string; type: 'success' | 'error'; show: boolean } = {
    message: '',
    type: 'success',
    show: false
  };

  constructor(
    private route: ActivatedRoute,
    private accommodationService: AccommodationService,
    private landlordService: LandlordService
  ) { }

  ngOnInit() {
    const accommodationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAccommodationData(accommodationId);
    this.loadRequests(accommodationId);
  }

  loadAccommodationData(id: number) {
    this.accommodationService.getAccommodationDetail(id).subscribe(data => {
      this.accommodation = data;
    });
  }

  loadRequests(id: number) {
    this.landlordService.getRequestsByAccommodationId(id).subscribe(data => {
      this.requests = data;
    });
  }
  acceptRequest(id: number) {
    const request = this.requests.find(r => r.id === id);
    const studentName = request?.studentName || request?.applicantName || 'el estudiante';
    
    this.landlordService.updateRequestStatus(id, 'ACEPTADO').subscribe({
      next: () => {
        // Remove request from the list
        this.requests = this.requests.filter(r => r.id !== id);
        
        // Show success notification
        this.showNotification(`Solicitud de ${studentName} aceptada exitosamente`, 'success');
      },
      error: (error) => {
        console.error('Error accepting request:', error);
        this.showNotification('Error al aceptar la solicitud. Intente nuevamente.', 'error');
      }
    });
  }

  rejectRequest(id: number) {
    const request = this.requests.find(r => r.id === id);
    const studentName = request?.studentName || request?.applicantName || 'el estudiante';
    
    this.landlordService.updateRequestStatus(id, 'RECHAZADO').subscribe({
      next: () => {
        // Remove request from the list
        this.requests = this.requests.filter(r => r.id !== id);
        
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


  getImageUrls(): string[] {
    return this.accommodation?.imagenes?.map(img => img.url) || [];
  }
}
