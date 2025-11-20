import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestItem } from '../../../../core/models/landlord.models';

@Component({
  selector: 'app-requests-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests-section.component.html',
  styleUrls: ['./requests-section.component.css']
})
export class RequestsSectionComponent {
  @Input() requests: RequestItem[] = [];
  activeTab: string = 'recientes';
}
