import { Injectable } from '@angular/core';
import { Zone } from '../models/student.models';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private zones: Zone[] = [
        {
            id: 1,
            name: 'Surco',
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            secondaryImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            securityRating: 4.5,
            averagePrice: 3500,
            nearbyUniversities: ['UPC MO', 'ESAN', 'UDEP'],
            mobilityOptions: ['Bicicleta', 'A pie', 'Bus'],
            description: 'Conocido como el distrito jardín de Lima. Surco equilibra zonas residenciales tranquilas, extensas áreas verdes y una vibrante actividad comercial y gastronómica.'
        },
        { id: 2, name: 'Surquillo', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 3, name: 'San Isidro', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 4, name: 'Miraflores', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 5, name: 'Chorrillos', image: 'https://images.unsplash.com/photo-1558036117-15db527544f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 6, name: 'Lince', image: 'https://images.unsplash.com/photo-1600596542815-277d62eab2b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 7, name: 'Lima', image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 8, name: 'Barranco', image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ];

    constructor() { }

    getZones(): Observable<Zone[]> {
        return of(this.zones);
    }

    getZoneById(id: number): Observable<Zone | undefined> {
        const zone = this.zones.find(z => z.id === id);
        return of(zone);
    }
}
