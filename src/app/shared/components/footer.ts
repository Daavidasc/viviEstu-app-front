import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer', //como se va a llamar al componente
  standalone: true,
  imports: [CommonModule],
  template: `
  <footer class="footer">
    <div class="footer-content">
      <div class="logo-section">
        <img class="footer-logo" src="/assets/LogoFull.jpg">
        <p>contacto@viviEstuapp.com</p>
        <p>+51 987 654 321</p>
        <p>ANGAMOS ESTE 6767,</p>
        <p>LIMA 54321 PERU</p>
        <div class="social-media">
          <a href="#"><img src="/assets/facebook-icon.png" alt="Facebook"></a>
          <a href="#"><img src="/assets/twitter-icon.png" alt="Twitter"></a>
          <a href="#"><img src="/assets/instagram-icon.png" alt="Instagram"></a>
      </div>
      </div> 
      <nav class="footer-nav">
        <p>Enlaces</p>
        <a href="#">Inicio</a>
        <a href="#">Quienes Somos</a>
        <a href="#">FAQ</a>
        <a href="#">Unete</a>
      </nav>

      <p>&copy; 2024 ViviEstu. Todos los derechos reservados.</p>
    </div>
  </footer>
  `,
  styles: []
})
export class FooterComponent {}