import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { Accommodation } from '../../../core/models/student.models';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-accommodations-page',
    standalone: true,
    imports: [CommonModule, AccommodationCardComponent, StudentNavbarComponent, FooterComponent, FormsModule],
    templateUrl: './accommodations-page.component.html',
    styleUrls: ['./accommodations-page.component.css']
})
export class AccommodationsPageComponent implements OnInit {
    accommodations: Accommodation[] = [];
    district: string | null = null;

    showFilterModal = false;
    filterCriteria = {
        district: 'Todos',
        university: 'Todas',
        minPrice: null as number | null,
        maxPrice: null as number | null
    };

    districts = ['Todos', 'Monterrico', 'Surco', 'San Borja', 'San Isidro', 'Miraflores', 'Barranco', 'La Molina'];
    universities = ['Todas', 'UPC Monterrico', 'Universidad de Lima', 'ESAN', 'Ricardo Palma'];

    constructor(
        private route: ActivatedRoute,
        private accommodationService: AccommodationService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.district = params['district'];
            const university = params['university'];

            if (this.district) {
                this.filterCriteria.district = this.district;
                this.loadAccommodationsByDistrict(this.district);
            } else if (university) {
                this.filterCriteria.university = university;
                this.loadAccommodationsByUniversity(university);
            } else {
                // Default to Monterrico as requested
                this.district = 'Monterrico';
                this.filterCriteria.district = 'Monterrico';
                this.loadAccommodationsByDistrict(this.district);
            }
        });
    }

    loadAccommodationsByDistrict(district: string): void {
        this.accommodationService.getAccommodationsByDistrict(district).subscribe(data => {
            this.accommodations = data;
        });
    }

    loadAccommodationsByUniversity(university: string): void {
        this.accommodationService.getAccommodationsByUniversity(university).subscribe(data => {
            this.accommodations = data;
        });
    }

    loadAllAccommodations(): void {
        this.accommodationService.getAccommodations().subscribe(data => {
            this.accommodations = data;
        });
    }

    handleFavoriteToggle(item: Accommodation): void {
        this.accommodationService.toggleFavorite(item.id);
    }

    toggleFilterModal(): void {
        this.showFilterModal = !this.showFilterModal;
    }

    applyFilters(): void {
        const filters = {
            ...this.filterCriteria,
            minPrice: this.filterCriteria.minPrice ?? undefined,
            maxPrice: this.filterCriteria.maxPrice ?? undefined
        };
        this.accommodationService.filterAccommodations(filters).subscribe(data => {
            this.accommodations = data;
            this.district = this.filterCriteria.district !== 'Todos' ? this.filterCriteria.district : null;
            this.toggleFilterModal();
        });
    }
}
