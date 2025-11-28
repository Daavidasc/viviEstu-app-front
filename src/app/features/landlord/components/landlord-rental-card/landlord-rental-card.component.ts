import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyRentalViewModel } from '../../../../core/models/landlord.models';


@Component({
  selector: 'app-landlord-rental-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landlord-rental-card.component.html',
  styleUrls: ['./landlord-rental-card.component.css']
})
export class LandlordRentalCardComponent {
  @Input() rental!: MyRentalViewModel;
}
