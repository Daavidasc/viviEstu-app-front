import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Accommodation } from '../../../../core/models/student.models';

@Component({
  selector: 'app-accommodation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accommodation-card.component.html',
  styleUrls: ['./accommodation-card.component.css']
})
export class AccommodationCardComponent {
  @Input() accommodation!: Accommodation;
  @Output() favoriteToggled = new EventEmitter<Accommodation>();

  toggleFavorite() {
    this.favoriteToggled.emit(this.accommodation);
  }
}
