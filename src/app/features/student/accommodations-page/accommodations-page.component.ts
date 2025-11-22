import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LocationService } from '../../../core/services/location.service';
import { AccommodationCardViewModel } from '../../../core/models/ui-view.models';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-accommodations-page',
    standalone: true,
    imports: [CommonModule, AccommodationCardComponent, StudentNavbarComponent, FooterComponent, FormsModule, LoadingSpinnerComponent],
    templateUrl: './accommodations-page.component.html',
    styleUrls: ['./accommodations-page.component.css']
})
export class AccommodationsPageComponent implements OnInit {
    accommodations: AccommodationCardViewModel[] = [];
    district: string | null = null;
    isLoading = true;

    showFilterModal = false;
    filterCriteria = {
        district: 'Todos',
        university: 'Todas',
        minPrice: null as number | null,
        maxPrice: null as number | null
    };

    districts: string[] = ['Todos'];
    universities: string[] = ['Todas'];

    constructor(
        private route: ActivatedRoute,
        private accommodationService: AccommodationService,
        private locationService: LocationService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // Cargar distritos y universidades disponibles
        this.loadFilterOptions();

        this.route.queryParams.subscribe(params => {
            this.isLoading = true;
            this.district = params['district'];
            const university = params['university'];

            if (this.district) {
                this.filterCriteria.district = this.district;
                this.loadAccommodationsByDistrict(this.district);
            } else if (university) {
                this.filterCriteria.university = university;
                this.loadAccommodationsByUniversity(university);
            } else {
                // Cargar todos los alojamientos por defecto
                this.district = null;
                this.filterCriteria.district = 'Todos';
                this.loadAllAccommodations();
            }
        });
    }

    loadFilterOptions(): void {
        forkJoin({
            districts: this.locationService.getAllDistricts(),
            universities: this.locationService.getAllUniversities()
        }).subscribe({
            next: ({ districts, universities }) => {
                // Obtener nombres únicos de distritos
                const uniqueDistricts = [...new Set(districts.map(d => d.nombre))];
                this.districts = ['Todos', ...uniqueDistricts];

                // Obtener nombres únicos de universidades desde los alojamientos
                const uniqueUniversities = [...new Set(
                    universities
                        .map(a => a.nombre)
                        .filter((u): u is string => u !== undefined && u !== '')
                )];
                this.universities = ['Todas', ...uniqueUniversities];

                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al cargar opciones de filtro:', err);
                // Mantener valores por defecto en caso de error
            }
        });
    }

    loadAccommodationsByDistrict(district: string): void {
        this.accommodationService.filterAccommodations({ district }).subscribe({
            next: (data) => {
                this.accommodations = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al cargar alojamientos:', err);
                this.accommodations = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadAccommodationsByUniversity(university: string): void {
        this.accommodationService.filterAccommodations({ university }).subscribe({
            next: (data) => {
                this.accommodations = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al cargar alojamientos:', err);
                this.accommodations = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadAllAccommodations(): void {
        this.accommodationService.getAllCards().subscribe({
            next: (data) => {
                this.accommodations = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al cargar alojamientos:', err);
                this.accommodations = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    handleFavoriteToggle(item: AccommodationCardViewModel): void {
        this.accommodationService.toggleFavorite(item.id);
    }

    toggleFilterModal(): void {
        this.showFilterModal = !this.showFilterModal;
    }

    applyFilters(): void {
        this.isLoading = true;
        const filters = {
            ...this.filterCriteria,
            minPrice: this.filterCriteria.minPrice ?? undefined,
            maxPrice: this.filterCriteria.maxPrice ?? undefined
        };
        this.accommodationService.filterAccommodations(filters).subscribe({
            next: (data) => {
                this.accommodations = data;
                this.district = this.filterCriteria.district !== 'Todos' ? this.filterCriteria.district : null;
                this.isLoading = false;
                this.toggleFilterModal();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al aplicar filtros:', err);
                this.accommodations = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }
}
