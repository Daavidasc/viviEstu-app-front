import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LandlordService } from '../../../core/services/landlord.service';
import { RequestViewModel, EstadoSolicitud } from '../../../core/models/request.models';

interface AccommodationWithRequests {
  id: number;
  title: string;
  address: string;
  district: string;
  price: number;
  imageUrl: string;
  requests: RequestViewModel[];
}

@Component({
  selector: 'app-accommodation-requests-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LandlordNavbarComponent, FooterComponent],
  templateUrl: './accommodation-requests-page.component.html',
  styleUrls: ['./accommodation-requests-page.component.css']
})
export class AccommodationRequestsPageComponent implements OnInit {
  accommodationsWithRequests: AccommodationWithRequests[] = [];
  isLoading = true;

  // Notification system
  notification: { message: string; type: 'success' | 'error'; show: boolean } = {
    message: '',
    type: 'success',
    show: false
  };

  constructor(private landlordService: LandlordService) {}

  ngOnInit() {
    this.loadAccommodationsWithRequests();
  }

  loadAccommodationsWithRequests() {
    this.isLoading = true;
    
    // Load real accommodations and their requests
    this.landlordService.getMyAccommodations().subscribe({
      next: (accommodations) => {
        console.log('Loaded accommodations:', accommodations); // Debug log
        
        // For each accommodation, load its requests
        const accommodationsPromises = accommodations.map(acc => 
          this.landlordService.getRequestsByAccommodationId(acc.id).toPromise().then(requests => ({
            id: acc.id,
            title: acc.description,
            address: `${acc.district}`, // You might need to adjust this based on available data
            district: acc.district,
            price: acc.price,
            imageUrl: acc.image,
            requests: requests || []
          }))
        );
        
        Promise.all(accommodationsPromises).then(result => {
          console.log('Loaded accommodations with requests:', result); // Debug log
          this.accommodationsWithRequests = result;
          this.isLoading = false;
        }).catch(error => {
          console.error('Error loading requests for accommodations:', error);
          this.isLoading = false;
        });
      },
      error: (error) => {
        console.error('Error loading accommodations:', error);
        // Fallback to mock data if API fails
        this.loadMockData();
      }
    });
  }

  private loadMockData() {
    console.log('Loading mock data as fallback'); // Debug log
    this.accommodationsWithRequests = [
      {
        id: 1,
        title: 'Departamento cerca a UPC Monterrico',
        address: 'Jr. Alonso de Molina 1231',
        district: 'Monterrico',
        price: 650,
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        requests: [
          {
            requestId: 1,
            title: 'Marcelo Hernandez',
            subtitle: 'UPC',
            image: 'https://via.placeholder.com/40x40',
            status: 'PENDIENTE',
            statusColor: 'yellow',
            date: new Date(),
            message: 'Hola, estoy interesado en este departamento para el próximo semestre. ¿Podríamos agendar una visita?',
            price: 650
          }
        ]
      }
    ];
    this.isLoading = false;
  }

  acceptRequest(requestId: number) {
    const request = this.findRequestById(requestId);
    const studentName = request?.title || 'el estudiante';
    
    console.log('Attempting to accept request:', requestId); // Debug log
    
    this.landlordService.updateRequestStatus(requestId, 'ACEPTADO').subscribe({
      next: () => {
        console.log('Request accepted successfully'); // Debug log
        // Find and update the request status
        this.accommodationsWithRequests.forEach(accommodation => {
          const request = accommodation.requests.find(r => r.requestId === requestId);
          if (request) {
            request.status = 'AGENDADO';
            request.statusColor = 'green';
          }
        });
        
        // Show success notification
        this.showNotification(`Solicitud de ${studentName} aceptada exitosamente`, 'success');
      },
      error: (error) => {
        console.error('Error accepting request:', error);
        console.error('Error details:', JSON.stringify(error, null, 2)); // More detailed error
        console.error('Status:', error.status);
        console.error('URL:', error.url);
        this.showNotification(`Error ${error.status || 'desconocido'}: ${error.error?.message || error.message || 'Error al aceptar solicitud'}`, 'error');
      }
    });
  }

  rejectRequest(requestId: number) {
    const request = this.findRequestById(requestId);
    const studentName = request?.title || 'el estudiante';
    
    this.landlordService.updateRequestStatus(requestId, 'RECHAZADO').subscribe({
      next: () => {
        // Remove the request from the list
        this.accommodationsWithRequests.forEach(accommodation => {
          const requestIndex = accommodation.requests.findIndex(r => r.requestId === requestId);
          if (requestIndex !== -1) {
            accommodation.requests.splice(requestIndex, 1);
          }
        });
        
        // Show success notification
        this.showNotification(`Solicitud de ${studentName} rechazada`, 'success');
      },
      error: (error) => {
        console.error('Error rejecting request:', error);
        this.showNotification('Error al rechazar la solicitud. Intente nuevamente.', 'error');
      }
    });
  }

  private findRequestById(requestId: number): RequestViewModel | undefined {
    for (const accommodation of this.accommodationsWithRequests) {
      const request = accommodation.requests.find(r => r.requestId === requestId);
      if (request) return request;
    }
    return undefined;
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.notification = { message, type, show: true };
    
    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  }

  closeNotification() {
    this.notification.show = false;
  }

  getStatusClass(status: EstadoSolicitud): string {
    switch (status) {
      case 'PENDIENTE': return 'status-pending';
      case 'ACEPTADO': return 'status-accepted';
      case 'AGENDADO': return 'status-scheduled';
      case 'RECHAZADO': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  getTotalRequests(): number {
    return this.accommodationsWithRequests.reduce((total, acc) => total + acc.requests.length, 0);
  }
}