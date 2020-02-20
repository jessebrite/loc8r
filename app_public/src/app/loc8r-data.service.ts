import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Location } from './home-list/home-list.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

constructor(private http: HttpClient) { }

private apiBaseUrl = 'http://localhost:3000/api';

public getLocations(lat: number, lng: number): Promise<Location[]> {
  // const lng = 0.01768181;
  // const lat = 5.7236079;
  const maxDistance = 200;
  // The url could either be in a succint, difficult-to-read form
  // like the following commented
  // const url = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;

  // but I prefer a more verbose, readable way like this instead
  const params: string = [
    `lng=${lng}`,
    `lat=${lat}`,
    `maxDistance=${maxDistance}`
  ].join('&');
  const url = `${this.apiBaseUrl}/locations?${params}`;
  return this.http
    .get(url)
    .toPromise()
    .then(response => response as Location[])
    .catch(this.handleErrors);
}

public getLocationById(locationid: string): Promise<Location> {
  const url = `${this.apiBaseUrl}/locations/${locationid}`;
  return this.http
    .get(url)
    .toPromise()
    .then(response => response as Location)
    .catch(this.handleErrors);
}

  private handleErrors(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public addReviewByLocationId(locationid: string, formData: any): Promise<any> {
    const url = `${this.apiBaseUrl}/locations/${locationid}/reviews`;
    return this.http
      .post(url, formData)
      .toPromise()
      .then(response => response as any)
      .catch(this.handleErrors);
  }

}
