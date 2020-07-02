import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeolocationService } from './geolocation.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private REST_API_SERVER = environment.searchApiURL;

  constructor(private httpClient: HttpClient, private geoService : GeolocationService) { }

  public async searchDepartures(term : string, routeTypeNumber: number) : Promise<any> {

    let response = null;

    response = this.httpClient.get(this.REST_API_SERVER.replace("{term}", term).replace("{routeType}", routeTypeNumber.toString()));

    return response;
  }
}
