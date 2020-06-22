import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss']
})
export class NearbyComponent implements OnInit {

  constructor(private nearbyService : NearbyService) { }

  departures = [];

  ngOnInit(): void {
    this.nearbyService.getDeparturesNearby().subscribe((data: any[]) => {
      console.log(data);
      this.departures = data;
    } )
  }

}
