import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeolocationService } from './geolocation.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NearbyService {

  private REST_API_SERVER = "/api/search/routes/{latlong}/200";

  constructor(private httpClient: HttpClient, private geoService : GeolocationService) { }

  public async getDeparturesNearby() : Promise<any> {
    
    let lat = -37.8183886;
    let lng = 144.9524854;
    let response = null;

    let position = await this.geoService.getPosition()
      .then(pos => {
        lat = pos.lat; lng = pos.lng;
        console.log(lat + "," + lng);    

        //Override location for testing outside of melbourne
        //lat = -37.8183886;
        //lng = 144.9524854;

        response = this.httpClient.get(this.REST_API_SERVER.replace("{latlong}", lat + "," + lng))
      });

    console.log(lat + "," + lng);    

    return response;
  }
}
