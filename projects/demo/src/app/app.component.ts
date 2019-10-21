import { Component, OnInit, Input } from '@angular/core';
<<<<<<< HEAD
import {OverlayContainer} from '@angular/cdk/overlay';

import { Subscription } from 'rxjs';
import { Dialogs } from 'jsplumbtoolkit';
=======
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';

import { Subscription } from 'rxjs';
import { LCUServiceSettings } from '@lcu/common';
>>>>>>> d491d0af9ed8a98a9e6f839fc7776bb89adfaf00

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

<<<<<<< HEAD
  protected themesSubscriptions: Subscription;

  constructor(
    protected overlayContainer: OverlayContainer) {

    this.BackgroundImage = './assets/images/bg_image.jpg';
  }

  public ngOnInit(): void {
   
  }
=======
  constructor(protected overlayContainer: OverlayContainer, protected settings: LCUServiceSettings) {
    this.BackgroundImage = './assets/images/bg_image.jpg';
>>>>>>> d491d0af9ed8a98a9e6f839fc7776bb89adfaf00

    this.Config = {
      Assets: ['https://www.fathym-int.com/_lcu/lcu-data-flow/wc/lcu-data-flow.lcu.js'],
      ElementName: 'lcu-data-flow-manager-element'
    };
  }

  public ngOnInit(): void {}
}
