import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { jsPlumbToolkitDragDropModule } from 'jsplumbtoolkit-angular-drop';
import { ChartsModule } from 'ng2-charts';
import { LazyElementModule } from '@lowcodeunit/lazy-element';

import { LcuDataFlowDataFlowManagerElementComponent } from './elements/data-flow-manager/data-flow-manager.component';
import { LcuDataFlowDataFlowListElementComponent } from './elements/data-flow-manager/controls/data-flow-list/data-flow-list.component';
import { LcuDataFlowDataFlowIdeElementComponent } from './elements/data-flow-manager/controls/data-flow-ide/data-flow-ide.component';
import { LcuDataFlowDataFlowModulesBankElementComponent } from './elements/data-flow-manager/controls/data-flow-modules-bank/data-flow-modules-bank.component';
import { DataFlowModuleComponent } from './elements/data-flow-manager/controls/data-flow-module/data-flow-module.component';
import { DataFlowJSPlumbToolkitIOService } from './services/data-flow-jsplumb-toolkit-io.service';
import { LcuDataFlowDataFlowAnalyticsElementComponent } from './elements/data-flow-analytics/data-flow-analytics.component';
import { DialogBodyComponent } from './elements/data-flow-manager/controls/dialog-body/dialog-body.component';
import { LcuDataFlowDataFlowMapElementComponent } from './elements/data-flow-map/data-flow-map.component';
import { DataFlowMapJSPlumbToolkitIOService } from './services/data-flow-map-jsplumb-toolkit-io.service';
import { DialogModuleConfigureComponent } from './elements/data-flow-manager/controls/dialog-module-configure/dialog-module-configure.component';
import { DataFlowManagerEventService } from './elements/data-flow-manager/data-flow-manager-event.service';

@NgModule({
  declarations: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    LcuDataFlowDataFlowAnalyticsElementComponent,
    LcuDataFlowDataFlowMapElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent,
    DialogModuleConfigureComponent
  ],
  entryComponents: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    LcuDataFlowDataFlowAnalyticsElementComponent,
    LcuDataFlowDataFlowMapElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent,
    DialogModuleConfigureComponent
  ],
  exports: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    LcuDataFlowDataFlowAnalyticsElementComponent,
    LcuDataFlowDataFlowMapElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent,
    DialogModuleConfigureComponent
  ],
  imports: [
    FathymSharedModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    jsPlumbToolkitModule,
    jsPlumbToolkitDragDropModule,
    ChartsModule,
    LazyElementModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LcuDataFlowModule {
  constructor() {}

  public static forRoot(): ModuleWithProviders<LcuDataFlowModule> {
    return {
      ngModule: LcuDataFlowModule,
      providers: [
        DataFlowJSPlumbToolkitIOService,
        DataFlowMapJSPlumbToolkitIOService,
        DataFlowManagerEventService
      ]
    };
  }
}
