
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestViewModel } from '../../../../core/models/request.models';


@Component({
  selector: 'app-requests-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests-section.component.html',
  styleUrls: ['./requests-section.component.css']
})
export class RequestsSectionComponent {
  @Input() requests: RequestViewModel[] = [];
  activeTab: string = 'recientes';
}
