import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LandlordRentalCardComponent } from '../components/landlord-rental-card/landlord-rental-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { LandlordService } from '../../../core/services/landlord.service';
import { MyRentalViewModel } from '../../../core/models/landlord.models';

@Component({
    selector: 'app-my-accommodations-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        LandlordNavbarComponent,
        FooterComponent,
        LandlordRentalCardComponent,
        LoadingSpinnerComponent
    ],
    templateUrl: './my-accommodations-page.component.html',
    styleUrls: ['./my-accommodations-page.component.css']
})
export class MyAccommodationsPageComponent implements OnInit {
    private landlordService = inject(LandlordService);

    myRentals: MyRentalViewModel[] = [];
    isLoading = true;
    error: string | null = null;
    cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.loadAccommodations();
    }

    loadAccommodations() {
        this.isLoading = true;
        this.landlordService.getMyAccommodations().subscribe({
            next: (rentals) => {
                this.myRentals = rentals;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading rentals', err);
                this.error = 'No se pudieron cargar tus propiedades. Por favor, intenta de nuevo más tarde.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }
}
