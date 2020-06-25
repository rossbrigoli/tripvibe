import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { Observable } from 'rxjs';
import { variable } from '@angular/compiler/src/output/output_ast';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss']
})
export class NearbyComponent implements OnInit {

  constructor(private nearbyService : NearbyService) { }

  departures = [];
  loaded = false;

  ngOnInit(): void {
    this.nearbyService.getDeparturesNearby().then((data: Observable<any[]>) => {
      data.subscribe((deps) => {
        console.log(deps);
        this.departures = deps.sort((a, b) => new Date(a.departureTime).valueOf() - new Date(b.departureTime).valueOf());
        this.loaded = true;
      } );
    } );

    this.now = new Date();
  }

  getTypeIcon(type : string) {
    if (type.toLowerCase() === "bus")
      return "directions_bus";
    else if (type.toLowerCase() === "tram")
      return "tram";
    else if (type.toLowerCase() === "train" || type.toLowerCase() == "vline")
      return "directions_transit";
  }

  getTypeColor(type: string) {
    if (type.toLowerCase() === "bus")
      return "orange";
    else if (type.toLowerCase() === "tram")
      return "green";
    else if (type.toLowerCase() === "train" || type.toLowerCase() == "vline")
      return "purple";
  }

  now = new Date();
  refresh(){
    this.loaded = false;
    this.nearbyService.getDeparturesNearby().then((data: Observable<any[]>) => {
      data.subscribe((deps) => {
        console.log(deps);
        this.departures = deps.sort((a, b) => new Date(a.departureTime).valueOf() - new Date(b.departureTime).valueOf());
        this.loaded = true;
      } );
    } );
    this.now = new Date();
  }

  getETA(depTime: string) : string {
    let eta : number = new Date(depTime).valueOf() - this.now.valueOf();
    let minETA = Math.ceil(eta / 1000 / 60);
    return minETA == 0 ? "Now" : minETA.toString();
  }

}
