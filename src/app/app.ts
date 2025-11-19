import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarLandingComponent } from './shared/components/navbar-landing';
import { LandingLayoutComponent } from './shared/layouts/landing-layout';
import { FooterComponent } from './shared/components/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarLandingComponent, LandingLayoutComponent, FooterComponent],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('viviEstu-app');
}
