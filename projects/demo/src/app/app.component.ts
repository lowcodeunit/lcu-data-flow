import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';

import { Subscription } from 'rxjs';
import { LCUServiceSettings } from '@lcu/common';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public BackgroundImage: string;

  public LazyConfig: LazyElementConfig;

  public SelectedTheme: string;

  public ShowMap: boolean = true;

  constructor(protected overlayContainer: OverlayContainer, protected settings: LCUServiceSettings) {
    this.BackgroundImage = './assets/images/bg_image.jpg';

    this.LazyConfig = {
      Assets: ['/assets/wc/lcu-data-flow.lcu.js'],
      ElementName: 'lcu-data-flow-manager-element'
    };
  }

  public ngOnInit(): void {}

  public Toggle(): void {
    this.ShowMap = !this.ShowMap;
  }
}
