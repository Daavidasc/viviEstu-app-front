import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Zone } from '../../../../core/models/student.models';

@Component({
  selector: 'app-district-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './district-card.component.html',
  styleUrls: ['./district-card.component.css']
})
export class DistrictCardComponent {
  @Input() zone!: Zone;
}