import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../components/footer';
import { LandingComponent } from '../../features/landing/pages/landingComponent';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, LandingComponent],
  template: `
  <div class="navbar">
  <nav class="navegacion-principal">
    <a href="#" > <img class="img" src="/assets/LogoFull.jpg"></a>
    <ul>
    <li><a href="#">Quienes Somos</a></li>
    <li><a href="#">Preguntas Frecuentes</a></li>
    <li><a href="#">Contactenos</a></li>
    </ul>

    
    <a href="#" class="button">Unete Ahora</a>
  </nav>
  </div>

    <main>
      <app-Landing />
    </main>

  <app-footer/>
  
  `,
  styles: [`
    .navbar {
      background-color: #FFFFFF;
      padding: 1.5rem 0;
      margin: 0;
      font-size: 18px;
      padding-left: 46px;
      padding-right: 46px;
    }

    nav{
      display: flex;
      justify-content: space-between;
    }

    ul {
      display: flex;
      flex-direction: row;
    }

    li {
      margin-left: 6rem;
      list-style: none;
      margin-right: 6rem;
    }

    ul {
      display: flex;
      align-items: center;
    }

    a{
      color: #000000;
      text-decoration: none;
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      display: flex;
      flex-direction: row;
      align-items: center;

    }
    .img {
      height: 38px;
    }

    .button {
      background-color: #B88E2F;
      color: #FFFFFF;
      padding: 11px 40px;
      border-radius: 8px;
      font-weight: 600;
    }
  `
  ]
})
export class LandingLayoutComponent {}