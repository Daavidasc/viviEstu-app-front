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
        <p class="direccion-p">ANGAMOS ESTE 6767,</p>
        <p>LIMA 54321 PERU</p>
        <div class="social-media">
          <a href="#"><img src="/assets/FacebookIcon.png" alt="Facebook"></a>
          <a href="#"><img src="/assets/InstagramIcon.png" alt="Instagram"></a>
          <a href="#"><img src="/assets/LinkedinIcon.png" alt="Linkedin"></a>
      </div>
      </div> 
      <nav class="footer-nav">
        <p>Enlaces</p>
        <a href="#">Inicio</a>
        <a href="#">Quienes Somos</a>
        <a href="#">FAQ</a>
        <a href="#">Unete</a>
      </nav>

    </div>
    <hr>

    <div class="derechos">
      <p>&copy; 2024 ViviEstu. Todos los derechos reservados.</p>
    </div>
  </footer>
  `,
  styles: [`

    .footer {
    background-color: #ffffffff;
    padding: 5rem 6rem;
    padding-bottom: 3rem;
    }

    p {
      font-size: 16px;
      color: #9F9F9F;
      font-family: "Poppins", sans-serif;
      font-weight: 400;
      margin: 0.2rem 0;
    }

    .footer-logo {
      height: 50px;
      margin-bottom: 1rem;
    }

    .footer-content {
      display: flex;
      gap: 8rem;
      height: 25rem;
    }

    .direccion-p {
      margin-top: 0.5rem;
    }

    .social-media img {
      height: 28px;
      margin-right: 2rem;
      margin-top: 3rem;
    }

    .footer-nav{
      display: flex;
      flex-direction: column;
    }

    .footer-nav p {
      margin-top: 1.2rem;
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .footer-nav a {
      font-size: 16px;
      text-decoration: none;
      color: #000000;
      font-family: "Poppins", sans-serif;
      font-weight: 400;
      margin: 1rem 0;

    }

    .derechos {
      text-align: right;
      margin-top: 1rem;
    }

  `]
})
export class FooterComponent {}