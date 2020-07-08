import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeolocationService } from './geolocation.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NearbyService {

  private REST_API_SERVER = environment.nearbyApiURL;

  constructor(private httpClient: HttpClient, private geoService : GeolocationService) { }

  public async getDeparturesNearby() : Promise<any> {
    
    let lat = -37.8183886;
    let lng = 144.9524854;
    let response = null;

    console.log("requesting geo location...");

    let position = await this.geoService.getPosition()
      .then(pos => {
        lat = pos.lat; lng = pos.lng;
        console.log("Actual Location: " + lat + "," + lng);    
        
        if (environment.overrideLocation) {
          //Override location for testing outside of melbourne
          lat = -37.8104234;
          lng = 144.9607266;
        }

        let query = this.REST_API_SERVER
        .replace("{latlong}", lat + "," + lng)
        .replace("{distance}", "300")
        .replace("{nextSeconds}", "3600")
        .replace("{pastSeconds}", "60");

        response = this.httpClient.get(query);
      });

    console.log("response = " + response)
    console.log("Overriden Location: " + lat + "," + lng);    

    return response;
  }

  public async getDeparturesForDataEntry() : Promise<any> {
    
    let lat = -37.8183886;
    let lng = 144.9524854;
    let response = null;

    let position = await this.geoService.getPosition()
      .then(pos => {
        lat = pos.lat; lng = pos.lng;
        console.log("Actual Location: " + lat + "," + lng);    
        
        if (environment.overrideLocation) {
          //Override location for testing outside of melbourne
          lat = -37.8104234;
          lng = 144.9607266;
        }

        let query = this.REST_API_SERVER
        .replace("{latlong}", lat + "," + lng)
        .replace("{distance}", "1000")
        .replace("{nextSeconds}", "900")
        .replace("{pastSeconds}", "600");

        response = this.httpClient.get(query);
      });

    console.log("Overriden Location: " + lat + "," + lng);    

    return response;
  }
}
