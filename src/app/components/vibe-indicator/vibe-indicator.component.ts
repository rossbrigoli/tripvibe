import { Component, OnInit, Input } from '@angular/core';
import { bindCallback } from 'rxjs';

@Component({
  selector: 'app-vibe-indicator',
  templateUrl: './vibe-indicator.component.html',
  styleUrls: ['./vibe-indicator.component.scss']
})
export class VibeIndicatorComponent implements OnInit {

  constructor() {

  }

  @Input() sentiment: number;

  iconName = "sentiment_neutral";
  vibe = 3;
  color = "darkslategray";

  ngOnInit(): void {

    this.vibe = Math.ceil(this.sentiment / 20);

    if (this.sentiment < 20) {
      this.iconName = "sentiment_very_dissatisfied";
      this.color = "darkred";
    } else if (this.sentiment >= 20 && this.sentiment < 40) {
      this.iconName = "sentiment_dissatisfied";
      this.color = "red";
    } else if (this.sentiment >= 40 && this.sentiment < 60) {
      this.iconName = "sentiment_neutral";
      this.color = "orangered";
    } else if (this.sentiment >= 60 && this.sentiment < 80) {
      this.iconName = "sentiment_satisfied";
      this.color = "orange";
    } else if (this.sentiment >= 80) {
      this.iconName = "sentiment_very_satisfied";
      this.color = "green";
    }
  }


}
