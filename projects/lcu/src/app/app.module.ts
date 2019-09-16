import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createCustomElement } from '@angular/elements';
import { FathymSharedModule } from '@lcu-ide/common';
import { BrowserModule } from '@angular/platform-browser';
import {
  LcuDataFlowModule,
  LcuDataFlowDataFlowManagerElementComponent,
  SelectorLcuDataFlowDataFlowManagerElement
} from '@lowcodeunit/lcu-data-flow-common';

@NgModule({
  declarations: [],
  imports: [BrowserModule, BrowserAnimationsModule, FathymSharedModule, LcuDataFlowModule],
  exports: [LcuDataFlowModule]
})
export class AppModule implements DoBootstrap {
  //  Constructors
  constructor(protected injector: Injector) {}

  //  Life Cycle
  public ngDoBootstrap() {
    const cfgMgr = createCustomElement(LcuDataFlowDataFlowManagerElementComponent, { injector: this.injector });

    customElements.define(SelectorLcuDataFlowDataFlowManagerElement, cfgMgr);
  }
}
