import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestDetailedItem } from '../../../../core/models/landlord.models';

@Component({
  selector: 'app-accommodation-requests-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accommodation-requests-list.component.html',
  styleUrls: ['./accommodation-requests-list.component.css']
})
export class AccommodationRequestsListComponent {
  @Input() requests: RequestDetailedItem[] = [];
}
