import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccommodationCardViewModel } from '../../../../core/models/ui-view.models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accommodation-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accommodation-card.component.html',
  styleUrls: ['./accommodation-card.component.css']
})
export class AccommodationCardComponent {
  @Input() accommodation!: AccommodationCardViewModel;
  @Output() favoriteToggled = new EventEmitter<AccommodationCardViewModel>();

  toggleFavorite() {
    // Emite la tarjeta completa para que el componente padre (la página)
    // pueda llamar al servicio para alternar el estado.
    this.favoriteToggled.emit(this.accommodation);
  }
}
