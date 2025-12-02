import { Component, Input } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandlordProfile } from '../../../core/models/landlord.models';


@Component({
  selector: 'app-landlord-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landlord-navbar.component.html',
  styleUrls: ['./landlord-navbar.component.css']
})
export class LandlordNavbarComponent {
  @Input() currentUser: LandlordProfile | null = null;
  imageLoadError = false;

  constructor(private authService: AuthService) { }

  handleImageError() {
    this.imageLoadError = true;
  }

  logout() {
    this.authService.logout();
  }
}
