import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="navbar">
  <nav class="navegacion-principal">
    <a href="#"> <img src="/assets/LogoFull.jpg">l</a>
    <a href="#">Acerca de</a>
    <a href="#">Servicios</a>
    <a href="#">Contacto</a>


  </nav>
  </div>

  `,
  styles: []
})
export class NavbarLandingComponent {}