import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { DistrictDetailViewModel } from '../../../core/models/ui-view.models';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-district-detail-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, RouterModule, LoadingSpinnerComponent],
  templateUrl: './district-detail-page.component.html',
  styleUrls: ['./district-detail-page.component.css']
})
export class DistrictDetailPageComponent implements OnInit {
  zone?: DistrictDetailViewModel;
  isLoading = true;
  error: string | null = null;
  imageLoadError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.isLoading = true;
        this.imageLoadError = false; // Resetear error de imagen
        this.locationService.getDetailedDistrictById(id).subscribe({
          next: (data) => {
            this.zone = data;
            this.isLoading = false;
            // Forzar detección de cambios
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
      // Navegar a la página de búsqueda con el distrito como filtro
      this.router.navigate(['student/accommodations'], {
        queryParams: { district: this.zone.nombre }
      });
    }
  }
}
