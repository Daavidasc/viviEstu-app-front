import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs'; // <--- IMPORTANTE: Importar esto
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
    // Definimos las dos peticiones
    const clicks$ = this.landlordService.getAccommodationTotalInteractions(this.rental.id);
    const requests$ = this.landlordService.getAccommodationRequestsCount(this.rental.id);

    // Ejecutamos ambas en paralelo
    forkJoin({
      clicks: clicks$,
      requests: requests$
    }).subscribe({
      next: (data) => {
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
