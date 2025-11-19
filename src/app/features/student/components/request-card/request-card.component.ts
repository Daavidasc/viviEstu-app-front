import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveRequest } from '../../../../core/models/student.models';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent {
  @Input() request!: ActiveRequest;
}
