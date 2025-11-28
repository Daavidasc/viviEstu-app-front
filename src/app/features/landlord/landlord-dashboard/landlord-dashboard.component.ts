import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { RequestsSectionComponent } from '../components/requests-section/requests-section.component';
import { LandlordRentalCardComponent } from '../components/landlord-rental-card/landlord-rental-card.component';

import { LandlordService } from '../../../core/services/landlord.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { MyRentalViewModel } from '../../../core/models/landlord.models';
import { RequestViewModel } from '../../../core/models/request.models';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, LandlordNavbarComponent, RequestsSectionComponent, LandlordRentalCardComponent, LoadingSpinnerComponent],
  templateUrl: './landlord-dashboard.component.html',
  styleUrls: ['./landlord-dashboard.component.css']
})
export class LandlordDashboardComponent implements OnInit {
  userName: string = '';
  requests: RequestViewModel[] = [];
  myRentals: MyRentalViewModel[] = [];
  isLoading = true;
  requestsError: string | null = null;

  constructor(
    private landlordService: LandlordService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    // Cargar perfil
    this.landlordService.getProfile().subscribe({
      next: (profile) => {
        this.userName = profile.nombre;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading profile', err)
    });

    // Cargar alojamientos
    this.landlordService.getMyAccommodations().subscribe({
      next: (rentals) => {
        this.myRentals = rentals;
        this.checkLoading();
      },
      error: (err) => {
        console.error('Error loading rentals', err);
        this.checkLoading();
      }
    });

    // Cargar solicitudes recientes
    this.landlordService.getIncomingRequests().subscribe({
      next: (reqs) => {
        // Mostrar solo las 3 más recientes
        this.requests = reqs.slice(0, 3);
        this.requestsError = null;
        this.checkLoading();
      },
      error: (err) => {
        console.error('Error loading requests', err);
        this.requestsError = 'No se encontraron solicitudes o hubo un error al cargarlas.';
        this.checkLoading();
      }
    });
  }

  private loadedCount = 0;
  private checkLoading() {
    this.loadedCount++;
    if (this.loadedCount >= 2) { // Esperamos a rentals y requests
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
