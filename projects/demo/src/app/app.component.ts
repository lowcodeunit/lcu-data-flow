import { Component, OnInit, Input } from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public BackgroundImage: string;

  constructor(protected overlayContainer: OverlayContainer) {

    this.BackgroundImage = './assets/images/bg_image.jpg';
  }

  public ngOnInit(): void {
  }
}
