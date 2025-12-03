import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { LandlordRentalCardComponent } from '../components/landlord-rental-card/landlord-rental-card.component';

import { LandlordService } from '../../../core/services/landlord.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { MyRentalViewModel, AccommodationAnalyticsViewModel } from '../../../core/models/landlord.models';
import { RequestViewModel } from '../../../core/models/request.models';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, LandlordNavbarComponent, LandlordRentalCardComponent, LoadingSpinnerComponent],
  templateUrl: './landlord-dashboard.component.html',
  styleUrls: ['./landlord-dashboard.component.css']
})
export class LandlordDashboardComponent implements OnInit {
  userName: string = '';
  requests: RequestViewModel[] = [];
  myRentals: MyRentalViewModel[] = [];
  analytics: AccommodationAnalyticsViewModel[] = [];
  isLoading = true;
  requestsError: string | null = null;
  analyticsError: string | null = null;

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

        // Cargar analíticas para cada alojamiento
        if (rentals.length === 0) {
          this.analytics = [];
          this.checkLoading(); // Analytics done (empty)
          return;
        }

        const analyticsRequests = rentals.map(rental =>
          this.landlordService.getAccommodationAnalytics(rental.id).pipe(
            catchError(error => {
              console.error(`Error loading analytics for rental ${rental.id}`, error);
              return of(null);
            })
          )
        );

        forkJoin(analyticsRequests).subscribe({
          next: (results) => {
            this.analytics = results.filter(res => res !== null) as AccommodationAnalyticsViewModel[];
            this.checkLoading(); // Analytics done
          },
          error: (err) => {
            console.error('Error loading analytics', err);
            this.analyticsError = 'Error al cargar estadísticas.';
            this.checkLoading(); // Analytics done (error)
          }
        });
      },
      error: (err) => {
        console.error('Error loading rentals', err);
        this.checkLoading(); // Rentals done (error)
        this.checkLoading(); // Analytics done (skipped)
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
    if (this.loadedCount >= 3) { // Esperamos a rentals, requests y analytics
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

}
