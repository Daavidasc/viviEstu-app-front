import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DistrictDetailViewModel } from '../models/ui-view.models';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private zones: DistrictDetailViewModel[] = [
        {
            id: 1,
            nombre: 'Surco',
            urlImg: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            secondaryImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            seguridad: 4.5,
            precioProm: 3500,
            universidades: ['UPC MO', 'ESAN', 'UDEP'],
            transportes: ['Bicicleta', 'A pie', 'Bus'],
            descripcion: 'Conocido como el distrito jardín de Lima. Surco equilibra zonas residenciales tranquilas, extensas áreas verdes y una vibrante actividad comercial y gastronómica.',
            tipo: 'Residencial'
        },
        {
            id: 2,
            nombre: 'Surquillo',
            urlImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            seguridad: 3.5,
            precioProm: 2500,
            universidades: [],
            transportes: [],
            descripcion: 'Distrito céntrico y comercial.',
            tipo: 'Comercial'
        },
        {
            id: 3,
            nombre: 'San Isidro',
            urlImg: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            seguridad: 5.0,
            precioProm: 4500,
            universidades: [],
            transportes: [],
            descripcion: 'Centro financiero de Lima.',
            tipo: 'Financiero'
        },
        {
            id: 4,
            nombre: 'Miraflores',
            urlImg: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            seguridad: 4.8,
            precioProm: 4000,
            universidades: [],
            transportes: [],
            descripcion: 'Distrito turístico por excelencia.',
            tipo: 'Turístico'
        },
        {
            id: 5,
            nombre: 'Chorrillos',
            urlImg: 'https://images.unsplash.com/photo-1558036117-15db527544f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            seguridad: 3.0,
            precioProm: 2000,
            universidades: [],
            transportes: [],
            descripcion: 'Distrito costero con historia.',
            tipo: 'Costero'
        },
        {
            id: 6,
            nombre: 'Lince',
            urlImg: 'https://images.unsplash.com/photo-1600596542815-277d62eab2b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            seguridad: 3.8,
            precioProm: 2800,
            universidades: [],
            transportes: [],
            descripcion: 'Distrito céntrico y accesible.',
            tipo: 'Céntrico'
        },
        {
            id: 7,
            nombre: 'Lima',
            urlImg: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            seguridad: 3.2,
            precioProm: 2200,
            universidades: [],
            transportes: [],
            descripcion: 'Centro histórico.',
            tipo: 'Histórico'
        },
        {
            id: 8,
            nombre: 'Barranco',
            urlImg: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            seguridad: 4.0,
            precioProm: 3200,
            universidades: [],
            transportes: [],
            descripcion: 'Distrito bohemio y cultural.',
            tipo: 'Bohemio'
        }
    ];

    constructor() { }

    getZones(): Observable<DistrictDetailViewModel[]> {
        return of(this.zones);
    }

    getZoneById(id: number): Observable<DistrictDetailViewModel | undefined> {
        const zone = this.zones.find(z => z.id === id);
        return of(zone);
    }
}
