import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccommodationCardViewModel } from '../../../../core/models/accommodation.models';

@Component({
  selector: 'app-comparison-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison-card.component.html',
  styleUrls: ['./comparison-card.component.css']
})
export class ComparisonCardComponent {
  @Input() item!: AccommodationCardViewModel;

  // Nuevo evento para notificar al padre
  @Output() changeRequested = new EventEmitter<void>();

  toggleFavorite() {
    this.item.isFavorite = !this.item.isFavorite;
  }

  // Método que se llama al dar click en "Cambiar"
  onRequestChange() {
    this.changeRequested.emit();
  }
}
