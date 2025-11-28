import { Component, Input } from '@angular/core';
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

  toggleFavorite() {
    this.item.isFavorite = !this.item.isFavorite;
  }
}
