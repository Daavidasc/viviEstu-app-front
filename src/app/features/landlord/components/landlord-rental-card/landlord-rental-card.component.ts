import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyRentalViewModel } from '../../../../core/models/landlord.models';
import { LandlordService } from '../../../../core/services/landlord.service';

@Component({
  selector: 'app-landlord-rental-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landlord-rental-card.component.html',
  styleUrls: ['./landlord-rental-card.component.css']
})
export class LandlordRentalCardComponent {
  @Input() rental!: MyRentalViewModel;

  constructor(private landlordService: LandlordService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.landlordService.getAccommodationTotalInteractions(this.rental.id).subscribe(interactions => {
      this.rental.clicks = interactions;
      this.cdr.detectChanges();
    });
  }

}
