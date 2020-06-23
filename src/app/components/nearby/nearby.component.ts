import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { Observable } from 'rxjs';
import { variable } from '@angular/compiler/src/output/output_ast';

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
        console.log(deps[0]);
        this.departures = deps[0];
        this.loaded = true;
      } );
    } );

    console.log(this.departures);
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

}
