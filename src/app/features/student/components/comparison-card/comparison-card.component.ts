import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccommodationDetail } from '../../../../core/models/student.models';

@Component({
  selector: 'app-comparison-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison-card.component.html',
  styleUrls: ['./comparison-card.component.css']
})
export class ComparisonCardComponent {
  @Input() item!: AccommodationDetail;

  toggleFavorite() {
    this.item.isFavorite = !this.item.isFavorite;
  }
}
