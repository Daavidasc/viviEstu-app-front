import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Componentes
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Servicios y Modelos
import { LocationService } from '../../../core/services/location.service';
import { DistrictDetailViewModel } from '../../../core/models/location.models';

@Component({
  selector: 'app-district-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    StudentNavbarComponent,
    FooterComponent,
    RouterModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './district-detail-page.component.html',
  styleUrls: ['./district-detail-page.component.css']
})
export class DistrictDetailPageComponent implements OnInit {
  // Inyección de dependencias
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private locationService = inject(LocationService);
  private cdr = inject(ChangeDetectorRef);

  zone?: DistrictDetailViewModel;
  isLoading = true;
  error: string | null = null;
  imageLoadError = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.isLoading = true;
        this.imageLoadError = false;

        this.locationService.getDistrictById(id).subscribe({
          next: (data) => {
            this.zone = data;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al cargar detalles del distrito:', err);
            this.error = 'No se pudieron cargar los detalles del distrito.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  onImageError(event: Event): void {
    this.imageLoadError = true;
    console.warn('Error al cargar imagen del distrito');
  }

  goBack(): void {
    this.location.back();
  }

  searchInDistrict(): void {
    if (this.zone) {
      this.router.navigate(['student/accommodations'], {
        queryParams: { district: this.zone.nombre }
      });
    }
  }
}
