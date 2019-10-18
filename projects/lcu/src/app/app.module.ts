import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createCustomElement } from '@angular/elements';
import { FathymSharedModule } from '@lcu/common';
import { BrowserModule } from '@angular/platform-browser';
import {
  LcuDataFlowModule,
  LcuDataFlowDataFlowManagerElementComponent,
  SelectorLcuDataFlowDataFlowManagerElement,
  LcuDataFlowDataFlowAnalyticsElementComponent,
  SelectorLcuDataFlowDataFlowAnalyticsElement
} from '@napkin-ide/lcu-data-flow-common';

@NgModule({
  declarations: [],
  imports: [BrowserModule, BrowserAnimationsModule, FathymSharedModule, LcuDataFlowModule.forRoot()],
  exports: [LcuDataFlowModule]
})
export class AppModule implements DoBootstrap {
  //  Constructors
  constructor(protected injector: Injector) {}

  //  Life Cycle
  public ngDoBootstrap() {
    const dsMgr = createCustomElement(LcuDataFlowDataFlowAnalyticsElementComponent, { injector: this.injector });

    customElements.define(SelectorLcuDataFlowDataFlowAnalyticsElement, dsMgr);

    const dfMgr = createCustomElement(LcuDataFlowDataFlowManagerElementComponent, { injector: this.injector });

    customElements.define(SelectorLcuDataFlowDataFlowManagerElement, dfMgr);
  }
}
