
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GalleryComponent } from '../../student/components/gallery/gallery.component';
import { AccommodationRequestsListComponent } from '../components/accommodation-requests-list/accommodation-requests-list.component';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LandlordService } from '../../../core/services/landlord.service';

import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AccommodationDetailViewModel } from '../../../core/models/accommodation.models';
import { RequestViewModel } from '../../../core/models/request.models';

@Component({
  selector: 'app-landlord-accommodation-detail',
  standalone: true,
  imports: [FormsModule, RouterModule, LandlordNavbarComponent, FooterComponent, GalleryComponent, AccommodationRequestsListComponent, LoadingSpinnerComponent],
  templateUrl: './landlord-accommodation-detail.component.html',
  styleUrls: ['./landlord-accommodation-detail.component.css']
})


export class LandlordAccommodationDetailComponent implements OnInit {
  accommodation: AccommodationDetailViewModel | null = null;
  requests: RequestViewModel[] = [];
  isLoading = true;

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
}
