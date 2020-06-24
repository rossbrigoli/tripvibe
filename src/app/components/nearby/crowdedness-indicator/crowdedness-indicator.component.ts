import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-crowdedness-indicator',
  templateUrl: './crowdedness-indicator.component.html',
  styleUrls: ['./crowdedness-indicator.component.scss']
})
export class CrowdednessIndicatorComponent implements OnInit {

  constructor() { }

  @Input() capacity: number
  filledStars = [];
  unfilledStars = [];

  ngOnInit(): void {  
    // const stars = Math.ceil(this.capacity / 20)
    // Temporary workaround while percentages aren't returned
    const stars = Math.ceil(Math.min(this.capacity, 100) / 20)
    this.filledStars = new Array(stars)
    this.unfilledStars = new Array(5 - stars)
    
  }
}
