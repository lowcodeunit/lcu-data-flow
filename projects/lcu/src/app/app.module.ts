import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createCustomElement } from '@angular/elements';
import {
  FathymSharedModule,
  LCUServiceSettings,
  JSONSchema
} from '@lcu/common';
import { BrowserModule } from '@angular/platform-browser';
import {
  LcuDataFlowModule,
  LcuDataFlowManagerElementComponent,
  SelectorLcuDataFlowManagerElement,
  LcuDataFlowAnalyticsElementComponent,
  SelectorLcuDataFlowAnalyticsElement,
  LcuDataFlowMapElementComponent,
  SelectorLcuDataFlowMapElement,
  LcuDataFlowSchemaMapElementComponent,
  SELECTOR_LCU_DATA_FLOW_SCHEMA_MAP_ELEMENT
} from '@napkin-ide/lcu-data-flow-common';
import 'zone.js';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FathymSharedModule,
    LcuDataFlowModule.forRoot()
  ],
  exports: [LcuDataFlowModule],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment)
    }
  ]
})
export class AppModule implements DoBootstrap {
  //  Constructors
  constructor(protected injector: Injector) {}

  //  Life Cycle
  public ngDoBootstrap() {
    const dsMgr = createCustomElement(LcuDataFlowAnalyticsElementComponent, {
      injector: this.injector
    });

    customElements.define(SelectorLcuDataFlowAnalyticsElement, dsMgr);

    const dfMgr = createCustomElement(LcuDataFlowManagerElementComponent, {
      injector: this.injector
    });

    customElements.define(SelectorLcuDataFlowManagerElement, dfMgr);

    const dfmMgr = createCustomElement(LcuDataFlowMapElementComponent, {
      injector: this.injector
    });

    customElements.define(SelectorLcuDataFlowMapElement, dfmMgr);

    const dataFlowSchemaMap = createCustomElement(
      LcuDataFlowSchemaMapElementComponent,
      { injector: this.injector }
    );

    customElements.define(
      SELECTOR_LCU_DATA_FLOW_SCHEMA_MAP_ELEMENT,
      dataFlowSchemaMap
    );
  }
}
