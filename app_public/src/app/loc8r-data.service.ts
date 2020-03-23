import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Location, Review } from './location';
import { User } from './user';
import { AuthResponse } from './auth-response';
import { BROWSER_STORAGE } from './storage';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) { }

  private apiBaseUrl = environment.apiBaseUrl;

  private handleErrors(error: any): Promise<any> {
    console.error('Something has gone wrong', error.error);
    return Promise.reject(error.error.message); // Message is trapped in the error object
  }

  public getLocations(lat: number, lng: number): Promise<Location[]> {
    // const lng = 0.01768181;
    // const lat = 5.7236079;
    const maxDistance = 200;
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

  public addReviewByLocationId(locationid: string, formData: Review): Promise<Review> {
    const url = `${this.apiBaseUrl}/locations/${locationid}/reviews`;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getItem('loc8r-token')}`
      })
    };
    return this.http
      .post(url, formData, httpOptions)
      .toPromise()
      .then(response => response as Review)
      .catch(this.handleErrors);
  }

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }
    public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  public makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(response => response as AuthResponse)
      .catch(this.handleErrors);
  }
}
