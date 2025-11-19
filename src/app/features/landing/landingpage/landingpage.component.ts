import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarLandingComponent } from '../../../shared/components/navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarLandingComponent, FooterComponent],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent {
  faqs: FaqItem[] = [
    {
      question: '¿La app es gratuita?',
      answer: 'Sí, puedes registrarte y explorar alojamientos sin costo.',
      isOpen: false
    },
    {
      question: '¿Cómo verifican los alojamientos?',
      answer: 'Cada publicación pasa por un proceso de validación para garantizar que sea confiable y segura.',
      isOpen: true // Abierto por defecto para resaltar
    },
    {
      question: '¿Puedo reservar directamente desde ViviEstu?',
      answer: 'Sí, puedes contactar al propietario y concretar tu reserva a través de nuestra plataforma.',
      isOpen: false
    },
    {
      question: '¿En qué distritos funciona?',
      answer: 'Actualmente estamos enfocados en Lima Metropolitana, cerca de las principales universidades.',
      isOpen: false
    }
  ];

  toggleFaq(index: number) {
    // Cierra todos los demás al abrir uno nuevo
    this.faqs.forEach((faq, i) => {
      if (i === index) {
        faq.isOpen = !faq.isOpen;
      } else {
        faq.isOpen = false;
      }
    });
  }
}
