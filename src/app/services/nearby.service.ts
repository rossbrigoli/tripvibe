import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class NearbyService {

  private REST_API_SERVER = "/api/search/routes/{latlong}/100";

  constructor(private httpClient: HttpClient, private geoService : GeolocationService) { }

  public getDeparturesNearby() : any {
    
    let lat = -37.8136;
    let lng = 144.9631;

    //let position = this.geoService.getPosition().then(pos => {lat = pos.lat; lng = pos.lng;});

    return this.httpClient.get(this.REST_API_SERVER.replace("{latlong}", lat + "," + lng));
  }
}
