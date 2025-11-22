import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LocationService } from '../../../core/services/location.service';
import { StudentService } from '../../../core/services/student.service'; // Importado
import { AccommodationCardViewModel } from '../../../core/models/ui-view.models';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

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
        private studentService: StudentService, // Inyectado
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // Cargar distritos y universidades disponibles
        this.loadFilterOptions();

        this.route.queryParams.subscribe(params => {
            this.isLoading = true;
            this.district = params['district'];
            const university = params['university'];

            // Cargar datos iniciales basados en query params
            if (this.district) {
                this.filterCriteria.district = this.district;
                this.loadAccommodationsByFilter({ district: this.district }); // Usar función de filtro
            } else if (university) {
                this.filterCriteria.university = university;
                this.loadAccommodationsByFilter({ university }); // Usar función de filtro
            } else {
                // Cargar todos los alojamientos por defecto
                this.district = null;
                this.filterCriteria.district = 'Todos';
                this.loadAccommodationsByFilter({}); // Cargar todos sin filtro
            }
        });
    }

    loadFilterOptions(): void {
        // ... (Tu lógica para cargar opciones de filtro es correcta)
        forkJoin({
            districts: this.locationService.getAllDistricts(),
            universities: this.locationService.getAllUniversities()
        }).subscribe({
            next: ({ districts, universities }) => {
                // Obtener nombres únicos de distritos
                const uniqueDistricts = [...new Set(districts.map(d => d.nombre))];
                this.districts = ['Todos', ...uniqueDistricts];

                // Obtener nombres únicos de universidades
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

    // NUEVA FUNCIÓN GENÉRICA DE CARGA QUE INCLUYE LÓGICA DE FAVORITOS
    loadAccommodationsByFilter(filters: any): void {
        this.isLoading = true;

        const accommodationObservable = Object.keys(filters).length === 0
            ? this.studentService.getAllAccommodationsWithFavoriteStatus()
            // 💡 Si hay filtros, primero carga los alojamientos filtrados y luego les añade el estado de favorito
            : this.accommodationService.filterAccommodations(filters).pipe(
                switchMap(filteredCards => {
                    // Si no hay resultados, devolver observable vacío para evitar error de merge
                    if (filteredCards.length === 0) return of([]);

                    // Obtener la lista de favoritos del usuario actual
                    return this.studentService.getFavorites().pipe(
                        map(favorites => {
                            const favIds = new Set(favorites.map(f => f.alojamientoId));
                            // Mapear los resultados filtrados para añadir el estado de favorito
                            return filteredCards.map(c => ({
                                ...c,
                                isFavorite: favIds.has(c.id)
                            }));
                        })
                    );
                })
            );

        accommodationObservable.subscribe({
            next: (data) => {
                this.accommodations = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al cargar alojamientos o aplicar favoritos:', err);
                this.accommodations = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // REMOVIDO: loadAccommodationsByDistrict (Ahora se usa loadAccommodationsByFilter)
    // REMOVIDO: loadAccommodationsByUniversity (Ahora se usa loadAccommodationsByFilter)
    // REMOVIDO: loadAllAccommodations (Ahora se usa loadAccommodationsByFilter)

    // CORREGIDO: Lógica del botón de favorito
    handleFavoriteToggle(item: AccommodationCardViewModel): void {
        this.studentService.toggleFavoriteStatus(item.id, item.isFavorite).subscribe({
            next: () => {
                // Actualización optimista de la UI
                item.isFavorite = !item.isFavorite;
                console.log(`Favorite status toggled for item ${item.id} to ${item.isFavorite}`);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al cambiar el estado de favorito:', err);
                alert('No se pudo actualizar el estado de favorito. Por favor, inténtalo de nuevo.');
            }
        });
    }

    // CORREGIDO: Usar loadAccommodationsByFilter en applyFilters
    applyFilters(): void {
        this.isLoading = true;
        const filters: any = {};

        // Mapear los criterios de filtro para que sean compatibles con el servicio
        if (this.filterCriteria.district !== 'Todos') {
            filters.district = this.filterCriteria.district;
        }
        if (this.filterCriteria.university !== 'Todas') {
            filters.university = this.filterCriteria.university;
        }
        if (this.filterCriteria.minPrice !== null) {
            filters.minPrice = this.filterCriteria.minPrice;
        }
        if (this.filterCriteria.maxPrice !== null) {
            filters.maxPrice = this.filterCriteria.maxPrice;
        }

        this.loadAccommodationsByFilter(filters); // Llamamos a la función genérica

        this.district = this.filterCriteria.district !== 'Todos' ? this.filterCriteria.district : null;
        this.toggleFilterModal();
    }

    toggleFilterModal(): void {
        this.showFilterModal = !this.showFilterModal;
    }
}
