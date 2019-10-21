import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createCustomElement } from '@angular/elements';
import { FathymSharedModule, LCUServiceSettings } from '@lcu/common';
import { BrowserModule } from '@angular/platform-browser';
import {
  LcuDataFlowModule,
  LcuDataFlowDataFlowManagerElementComponent,
  SelectorLcuDataFlowDataFlowManagerElement,
  LcuDataFlowDataFlowAnalyticsElementComponent,
  SelectorLcuDataFlowDataFlowAnalyticsElement
} from '@napkin-ide/lcu-data-flow-common';
import { Dialogs } from 'jsplumbtoolkit';
import 'zone.js';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [BrowserModule, BrowserAnimationsModule, FathymSharedModule, LcuDataFlowModule.forRoot()],
  exports: [LcuDataFlowModule],
  providers: [
    // {
    //   provide: LCUServiceSettings,
    //   useValue: FathymSharedModule.DefaultServiceSettings({ production: false })
    // }
  ]
})
export class AppModule implements DoBootstrap {
  //  Constructors
  constructor(protected injector: Injector) {
    Dialogs.initialize({
      selector: '.dlg'
    });
  }

  //  Life Cycle
  public ngDoBootstrap() {
    const dsMgr = createCustomElement(LcuDataFlowDataFlowAnalyticsElementComponent, { injector: this.injector });

    customElements.define(SelectorLcuDataFlowDataFlowAnalyticsElement, dsMgr);

    const dfMgr = createCustomElement(LcuDataFlowDataFlowManagerElementComponent, { injector: this.injector });

    customElements.define(SelectorLcuDataFlowDataFlowManagerElement, dfMgr);
  }
}
