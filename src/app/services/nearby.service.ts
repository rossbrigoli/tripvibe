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


  private BOUNDARY_WEST = 144.5099263;
  private BOUNDARY_EAST = 145.9765603;
  private BOUNDARY_NORTH = -37.3698897;
  private BOUNDARY_SOUTH = -38.4983352;
  private DEFAULT_LAT = -37.7287417;
  private DEFAULT_LONG = 144.9113903;

  public async getDeparturesNearby() : Promise<any> {

    let lat = -37.8183886;
    let lng = 144.9524854;
    let response = null;

    console.log("requesting geo location...");

    let position = await this.geoService.getPosition()
      .then(pos => {
        lat = pos.lat; lng = pos.lng;
        console.log("Current Location: " + lat + "," + lng);    
        
        // if current location outside Greater Melbourne boundaries, set default
        if (lat < this.BOUNDARY_SOUTH || lat > this.BOUNDARY_NORTH || lng < this.BOUNDARY_WEST || lng > this.BOUNDARY_EAST) {
          lat = this.DEFAULT_LAT;
          lng = this.DEFAULT_LONG;
          console.log("Out of bounds. Default Lat,Long: " + lat + "," + lng);
        }

        if (environment.overrideLocation) {
          //Override location for testing outside of melbourne
          lat = -37.8104234;
          lng = 144.9607266;
          console.log("Overriden Lat,Long: " + lat + "," + lng);
        }

        console.log("Query Lat,Long: " + lat + "," + lng);

        let query = this.REST_API_SERVER
        .replace("{latlong}", lat + "," + lng)
        .replace("{distance}", "300")
        .replace("{nextSeconds}", "3600")
        .replace("{pastSeconds}", "60");

        response = this.httpClient.get(query);
      });

    console.log("response = " + response)

    return response;
  }

  public async getDeparturesForDataEntry() : Promise<any> {
    
    let lat = -37.8183886;
    let lng = 144.9524854;
    let response = null;

    console.log("requesting geo location...");

    let position = await this.geoService.getPosition()
      .then(pos => {
        lat = pos.lat; lng = pos.lng;
        console.log("Actual Location: " + lat + "," + lng);    
        
        // if current location outside Greater Melbourne boundaries, set default
        if (lat < this.BOUNDARY_SOUTH || lat > this.BOUNDARY_NORTH || lng < this.BOUNDARY_WEST || lng > this.BOUNDARY_EAST) {
          lat = this.DEFAULT_LAT;
          lng = this.DEFAULT_LONG;
          console.log("Out of bounds. Default Lat,Long: " + lat + "," + lng);
        }
        
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

    console.log("Location: " + lat + "," + lng);    

    return response;
  }
}
