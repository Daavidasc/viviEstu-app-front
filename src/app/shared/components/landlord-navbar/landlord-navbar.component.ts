import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landlord-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landlord-navbar.component.html',
  styleUrls: ['./landlord-navbar.component.css']
})
export class LandlordNavbarComponent {
}
