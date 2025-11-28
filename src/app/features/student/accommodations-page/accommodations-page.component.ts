import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

// Componentes
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Servicios
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LocationService } from '../../../core/services/location.service';
import { StudentService } from '../../../core/services/student.service';
import { InteractionService } from '../../../core/services/interaction.service'; // 👈 1. IMPORTAR

// Modelos
import { AccommodationCardViewModel } from '../../../core/models/accommodation.models'; // 👈 2. RUTA CORRECTA

@Component({
    selector: 'app-accommodations-page',
    standalone: true,
    imports: [
        CommonModule,
        AccommodationCardComponent,
        StudentNavbarComponent,
        FooterComponent,
        FormsModule,
        LoadingSpinnerComponent,
        RouterModule
    ],
    templateUrl: './accommodations-page.component.html',
    styleUrls: ['./accommodations-page.component.css']
})
export class AccommodationsPageComponent implements OnInit {
    // Inyección de dependencias
    private route = inject(ActivatedRoute);
    private accommodationService = inject(AccommodationService);
    private locationService = inject(LocationService);
    private studentService = inject(StudentService);
    private interactionService = inject(InteractionService); // 👈 3. INYECTAR
    private cdr = inject(ChangeDetectorRef);

    accommodations: AccommodationCardViewModel[] = [];
    district: string | null = null;
    isLoading = true;
    currentStudentId: number | null = null; // Para gestionar favoritos

    showFilterModal = false;
    filterCriteria = {
        district: 'Todos',
        university: 'Todas',
        minPrice: null as number | null,
        maxPrice: null as number | null
    };

    districts: string[] = ['Todos'];
    universities: string[] = ['Todas'];

    ngOnInit(): void {
        // Cargar opciones de filtro
        this.loadFilterOptions();

        // Obtener ID del estudiante (necesario para favoritos)
        this.studentService.getProfile().subscribe({
            next: (p) => this.currentStudentId = p.id,
            error: () => console.warn('Usuario no logueado o error al cargar perfil')
        });

        // Suscribirse a cambios en la URL (Query Params)
        this.route.queryParams.subscribe(params => {
            this.isLoading = true;
            this.district = params['district'];
            const university = params['university'];

            // Configurar filtros iniciales según URL
            if (this.district) {
                this.filterCriteria.district = this.district;
                this.loadAccommodationsByFilter({ district: this.district });
            } else if (university) {
                this.filterCriteria.university = university;
                this.loadAccommodationsByFilter({ university });
            } else {
                this.district = null;
                this.filterCriteria.district = 'Todos';
                this.loadAccommodationsByFilter({});
            }
        });
    }

    loadFilterOptions(): void {
        forkJoin({
            districts: this.locationService.getAllDistricts(),
            universities: this.locationService.getAllUniversities()
        }).subscribe({
            next: ({ districts, universities }) => {
                const uniqueDistricts = [...new Set(districts.map(d => d.nombre))];
                this.districts = ['Todos', ...uniqueDistricts];

                const uniqueUniversities = [...new Set(
                    universities
                        .map(a => a.nombre)
                        .filter((u): u is string => u !== undefined && u !== '')
                )];
                this.universities = ['Todas', ...uniqueUniversities];
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error al cargar opciones de filtro:', err)
        });
    }

    loadAccommodationsByFilter(filters: any): void {
        this.isLoading = true;

        const accommodationObservable = Object.keys(filters).length === 0
            ? this.studentService.getAllAccommodationsWithFavoriteStatus()
            : this.accommodationService.filterAccommodations(filters).pipe(
                switchMap(filteredCards => {
                    if (filteredCards.length === 0) return of([]);

                    // Si hay resultados filtrados, cruzamos con favoritos
                    return this.studentService.getFavorites().pipe(
                        map(favorites => {
                            const favIds = new Set(favorites.map(f => f.alojamientoId));
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
                console.error('Error al cargar alojamientos:', err);
                this.accommodations = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // 👈 4. LÓGICA CORREGIDA DE FAVORITOS
    handleFavoriteToggle(item: AccommodationCardViewModel): void {
        if (!this.currentStudentId) {
            alert('Debes iniciar sesión para gestionar tus favoritos.');
            return;
        }

        const originalStatus = item.isFavorite;

        // Optimistic UI Update
        item.isFavorite = !item.isFavorite;

        this.interactionService.toggleFavorite(this.currentStudentId, item.id, originalStatus).subscribe({
            next: () => {
                console.log(`Favorito actualizado para: ${item.id}`);
            },
            error: (err) => {
                console.error('Error al cambiar favorito:', err);
                // Revertir en caso de error
                item.isFavorite = originalStatus;
                alert('No se pudo actualizar el favorito. Intenta de nuevo.');
                this.cdr.detectChanges();
            }
        });
    }

    applyFilters(): void {
        this.isLoading = true;
        const filters: any = {};

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

        this.loadAccommodationsByFilter(filters);
        this.district = this.filterCriteria.district !== 'Todos' ? this.filterCriteria.district : null;
        this.toggleFilterModal();
    }

    toggleFilterModal(): void {
        this.showFilterModal = !this.showFilterModal;
    }
}
