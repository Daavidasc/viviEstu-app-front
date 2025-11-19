import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-landing.component.html',
  styleUrls: ['./navbar-landing.component.css']
})
export class NavbarLandingComponent {
  // Lógica del Navbar si fuera necesaria en el futuro
}
