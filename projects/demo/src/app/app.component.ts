import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';

import { Subscription } from 'rxjs';
import { LCUServiceSettings } from '@lcu/common';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public BackgroundImage: string;

  public SelectedTheme: string;

  constructor(protected overlayContainer: OverlayContainer, protected settings: LCUServiceSettings) {
    this.BackgroundImage = './assets/images/bg_image.jpg';
  }

  public ngOnInit(): void {}
}
