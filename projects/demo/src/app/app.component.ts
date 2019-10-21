import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';

import { Subscription } from 'rxjs';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public Config: LazyElementConfig;

  public Context: any = null;

  public BackgroundImage: string;

  public SelectedTheme: string;

  public title = 'demo';

  constructor(protected overlayContainer: OverlayContainer) {
    this.BackgroundImage = './assets/images/bg_image.jpg';

    this.Config = {
      Assets: ['/assets/lcu-data-flow.lcu.js'],
      ElementName: 'lcu-data-flow-manager-element'
    };
  }

  public ngOnInit(): void {}
}
