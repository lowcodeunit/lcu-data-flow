import { Component, OnInit, Input } from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';

import { Subscription } from 'rxjs';
import { Dialogs } from 'jsplumbtoolkit';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public BackgroundImage: string;

  public DarkTheme: boolean;


  /**
   * For changing themes
   */
  public SelectedTheme: string;

  public title = 'demo';

  protected themesSubscriptions: Subscription;

  constructor(
    protected overlayContainer: OverlayContainer) {

    this.BackgroundImage = './assets/images/bg_image.jpg';
  }

  public ngOnInit(): void {
   
  }

  /**
   * Component loaded when routes change
   * 
   * @param evt router event
   */
  public OnActivate(evt: Event): void {
    this.routeChanged();
  }


  protected routeChanged(): void {

  }
}
