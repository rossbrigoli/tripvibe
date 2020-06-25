import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { DataEntryService } from '../../services/data-entry.service'
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {

  constructor(private nearbyService : NearbyService, private dataEntryService : DataEntryService) { }

  departures = [];
 
  ngOnInit(): void {
    this.nearbyService.getDeparturesNearby().then((data: Observable<any[]>) => {
      data.subscribe((deps) => {
        console.log(deps);
        this.departures = deps.sort((a, b) => new Date(a.departureTime).valueOf() - new Date(b.departureTime).valueOf());
      } );
    } );
  }

  onSubmit(form: NgForm) {
    this.dataEntryService.postData(form).then((data: Observable<any[]>) => {
      data.subscribe((res) => {
        console.log(res);
      });
    })
  }
}
