import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators'; // Importamos operadores necesarios

// Componentes
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Servicios
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LocationService } from '../../../core/services/location.service';
import { StudentService } from '../../../core/services/student.service';
import { InteractionService } from '../../../core/services/interaction.service';

// Modelos
import { AccommodationCardViewModel } from '../../../core/models/accommodation.models';

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
    private interactionService = inject(InteractionService);
    private cdr = inject(ChangeDetectorRef);

    accommodations: AccommodationCardViewModel[] = [];
    district: string | null = null;
    isLoading = true;
    currentStudentId: number | null = null;

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
        // 1. Cargar opciones para los selects (filtros)
        this.loadFilterOptions();

        // 2. Lógica principal: URL vs Perfil
        // Usamos switchMap para manejar la asincronía secuencialmente
        this.route.queryParams.pipe(
            switchMap(params => {
                this.isLoading = true;
                this.district = params['district'];
                const university = params['university'];

                // CASO A: La URL tiene filtros explícitos (ej: viene del dashboard "Ver más")
                if (this.district) {
                    this.filterCriteria.district = this.district;
                    console.log('Filtrando por URL (Distrito):', this.district);
                    return of({ filters: { district: this.district } });
                }

                if (university) {
                    this.filterCriteria.university = university;
                    console.log('Filtrando por URL (Universidad):', university);
                    return of({ filters: { university: university } });
                }

                // CASO B: La URL está limpia (ej: clic en Navbar "Alojamientos")
                // Aquí es donde ocurría tu error. Antes poníamos "Todos" por defecto.
                // AHORA: Consultamos el perfil actualizado para ver su preferencia.
                return this.studentService.getProfile().pipe(
                    map(profile => {
                        this.currentStudentId = profile.id; // Guardamos ID para favoritos

                        if (profile && profile.distrito) {
                            // Si el usuario tiene distrito, lo usamos por defecto
                            console.log('URL vacía. Usando preferencia de perfil:', profile.distrito);
                            this.district = profile.distrito;
                            this.filterCriteria.district = profile.distrito;
                            return { filters: { district: profile.distrito } };
                        } else {
                            // Si no tiene preferencia, mostramos todo
                            console.log('Sin preferencia de perfil. Mostrando todos.');
                            this.filterCriteria.district = 'Todos';
                            return { filters: {} };
                        }
                    }),
                    catchError((err) => {
                        console.warn('Error cargando perfil en fallback', err);
                        return of({ filters: {} }); // En caso de error, mostramos todo
                    })
                );
            })
        ).subscribe({
            next: (result) => {
                // Finalmente cargamos los alojamientos con el filtro decidido (URL o Perfil)
                this.loadAccommodationsByFilter(result.filters);
            },
            error: (err) => {
                console.error('Error crítico en inicialización', err);
                this.isLoading = false;
            }
        });

        // Carga auxiliar del ID (por si entramos por el Caso A, asegurarnos de tener el ID para favoritos)
        if (!this.currentStudentId) {
             this.studentService.getProfile().subscribe({
                next: (p) => this.currentStudentId = p.id,
                error: () => {} // Error silencioso, ya se maneja en otros lados
            });
        }
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

                    return this.studentService.getFavorites().pipe(
                        map(favorites => {
                            const favIds = new Set(favorites.map(f => f.alojamientoId));
                            return filteredCards.map(c => ({
                                ...c,
                                isFavorite: favIds.has(c.id)
                            }));
                        }),
                        catchError(() => of(filteredCards)) // Si falla favoritos, devuelve las cartas igual
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

    handleFavoriteToggle(item: AccommodationCardViewModel): void {
        if (!this.currentStudentId) {
            alert('Debes iniciar sesión para gestionar tus favoritos.');
            return;
        }

        const originalStatus = item.isFavorite;
        item.isFavorite = !item.isFavorite;

        this.interactionService.toggleFavorite(this.currentStudentId, item.id, originalStatus).subscribe({
            next: () => console.log(`Favorito actualizado para: ${item.id}`),
            error: (err) => {
                console.error('Error al cambiar favorito:', err);
                item.isFavorite = originalStatus;
                alert('No se pudo actualizar el favorito.');
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
        // Actualizamos visualmente el distrito actual si se usó el filtro
        this.district = this.filterCriteria.district !== 'Todos' ? this.filterCriteria.district : null;
        this.toggleFilterModal();
    }

    toggleFilterModal(): void {
        this.showFilterModal = !this.showFilterModal;
    }
}
