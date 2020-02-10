import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Location } from './home-list/home-list.component';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

constructor(private http: HttpClient) { }

private apiBaseUrl = 'http://localhost:3000/api';

public getLocations(): Promise<Location[]> {
  const lng: number = 0.01768181;
  const lat: number = 5.7236079;
  const maxDistance: number = 200;
  const url: string = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;
  return this.http
    .get(url)
    .toPromise()
    .then(response => response as Location[])
    .catch(this.handleErrors);
}

private handleErrors(error: any): Promise<any> {
  console.error('Something has gone wrong, error');
  return Promise.reject(error.message || error);
}

}
