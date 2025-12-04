import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MyRentalViewModel } from '../../../../core/models/landlord.models';
import { LandlordService } from '../../../../core/services/landlord.service';

@Component({
  selector: 'app-landlord-rental-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landlord-rental-card.component.html',
  styleUrls: ['./landlord-rental-card.component.css']
})
export class LandlordRentalCardComponent implements OnInit {
  @Input() rental!: MyRentalViewModel;

  constructor(
    private landlordService: LandlordService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Definimos las dos peticiones con manejo de errores individual
    const clicks$ = this.landlordService.getAccommodationTotalInteractions(this.rental.id).pipe(
      catchError(() => of(0))
    );

    const requests$ = this.landlordService.getAccommodationRequestsCount(this.rental.id).pipe(
      catchError(() => of(0))
    );

    // Ejecutamos ambas en paralelo
    forkJoin({
      clicks: clicks$,
      requests: requests$
    }).subscribe({
      next: (data: { clicks: number, requests: number }) => {
        // Asignamos los resultados a la tarjeta
        this.rental.clicks = data.clicks;
        this.rental.requestsCount = data.requests;

        // Forzamos la actualización de la vista
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando contadores', err);
      }
    });
  }
}
