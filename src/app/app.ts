import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarLandingComponent } from './shared/components/navbar-landing';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarLandingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('viviEstu-app');
}
