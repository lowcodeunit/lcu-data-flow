import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';

import { Subscription } from 'rxjs';
import { LCUServiceSettings } from '@lcu/common';

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

  constructor(protected overlayContainer: OverlayContainer, protected settings: LCUServiceSettings) {
    this.BackgroundImage = './assets/images/bg_image.jpg';

    this.Config = {
      Assets: ['https://www.fathym-int.com/_lcu/lcu-data-flow/wc/lcu-data-flow.lcu.js'],
      ElementName: 'lcu-data-flow-manager-element'
    };
  }

  public ngOnInit(): void {}
}
