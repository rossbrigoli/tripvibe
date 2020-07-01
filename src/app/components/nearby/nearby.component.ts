import { Component, OnInit, Input } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss']
})
export class NearbyComponent implements OnInit {

  constructor(private nearbyService : NearbyService, public router: Router) { }

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
    this.now = new Date();2
  }

  getETA(depTime: string) : string {
    let eta : number = new Date(depTime).valueOf() - this.now.valueOf();
    let minETA = Math.ceil(eta / 1000 / 60);
    return minETA == 0 ? "Now" : minETA.toString();
  }

  navigateWithState(index): void {
    this.router.navigateByUrl (
      '/data-entry', {state: {
        type: this.departures[index].type,
        stopName: this.departures[index].stopName,
        number: this.departures[index].number,
        name: this.departures[index].name,
        direction: this.departures[index].direction
      }}
    )
  }
}
