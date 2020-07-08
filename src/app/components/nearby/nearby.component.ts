import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { Observable } from 'rxjs';
import { variable } from '@angular/compiler/src/output/output_ast';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
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
    this.refresh();
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

        var items = deps.map(d => {
          return { departure: d, vibe: d.vibe === -1 ? 50 : d.vibe, capacity: d.capacity === -1 ? 50 : d.capacity }; // TODO: REPLACE THIS WITH REAL CAPACITY and VIBE API CALL
        });

        //console.log(items);

        this.departures = items.sort((a, b) => new Date(a.departure.departure_time).valueOf() - new Date(b.departure.departure_time).valueOf());
        //.filter(c => c.departure.route_number==="216");
        this.loaded = true;

        console.log(this.departures);
      } );
    } ).catch(() => {
      this.router.navigateByUrl("/search");
    });
  
    this.now = new Date();
  }

  getETA(depTime: string) : string {
    let eta : number = new Date(depTime).valueOf() - this.now.valueOf();
    let minETA = Math.ceil(eta / 1000 / 60);
    return minETA <= 0 ? " Now" : minETA.toString() + " min";
    //return minETA + " min";
  }

  navigateWithState(index): void {
    this.router.navigateByUrl (
      '/data-entry', {state: {
        type: this.departures[index].departure.route_type,
        stopName: this.departures[index].departure.stop_name,
        number: this.departures[index].departure.route_number,
        name: this.departures[index].departure.route_name,
        direction: this.departures[index].departure.direction
      }}
    )
  }
}
