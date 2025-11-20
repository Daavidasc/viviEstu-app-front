import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { Accommodation } from '../../../core/models/student.models';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
    selector: 'app-accommodations-page',
    standalone: true,
    imports: [CommonModule, AccommodationCardComponent, StudentNavbarComponent, FooterComponent],
    templateUrl: './accommodations-page.component.html',
    styleUrls: ['./accommodations-page.component.css']
})
export class AccommodationsPageComponent implements OnInit {
    accommodations: Accommodation[] = [];
    district: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private accommodationService: AccommodationService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.district = params['district'];
            const university = params['university'];

            if (this.district) {
                this.loadAccommodationsByDistrict(this.district);
            } else if (university) {
                this.loadAccommodationsByUniversity(university);
            } else {
                // Default to Monterrico as requested
                this.district = 'Monterrico';
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
}
