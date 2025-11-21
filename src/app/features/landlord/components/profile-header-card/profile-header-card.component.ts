import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordProfileViewModel } from '../../../../core/models/ui-view.models';

@Component({
  selector: 'app-profile-header-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-header-card.component.html',
  styleUrls: ['./profile-header-card.component.css']
})
export class ProfileHeaderCardComponent {
  @Input() landlord!: LandlordProfileViewModel;
}
