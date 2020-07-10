import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Stop } from '../models/stop.model';

@Injectable({
  providedIn: 'root'
})
export class StopsService {
  private REST_API_SERVER = environment.stopsApiURL;

  constructor(private httpClient: HttpClient) { }

  public async getStopsByRoute(routeId: number, routeType: number) : Promise<any> {
    let response = null;

    response = this.httpClient.get(this.REST_API_SERVER.replace("{route_id}", routeId.toString()).replace("{route_type}", routeType.toString()));

    //console.log("Other stops: " + response);
    return response;
  }
}
