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

import { LcuDataFlowManagerElementComponent } from './elements/data-flow-manager/data-flow-manager.component';
import { LcuDataFlowListElementComponent } from './elements/data-flow-manager/controls/data-flow-list/data-flow-list.component';
import { LcuDataFlowIdeElementComponent } from './elements/data-flow-manager/controls/data-flow-ide/data-flow-ide.component';
import { LcuDataFlowModulesBankElementComponent } from './elements/data-flow-manager/controls/data-flow-modules-bank/data-flow-modules-bank.component';
import { DataFlowModuleComponent } from './elements/data-flow-manager/controls/data-flow-module/data-flow-module.component';
import { DataFlowJSPlumbToolkitIOService } from './services/data-flow-jsplumb-toolkit-io.service';
import { LcuDataFlowAnalyticsElementComponent } from './elements/data-flow-analytics/data-flow-analytics.component';
import { DialogBodyComponent } from './elements/data-flow-manager/controls/dialog-body/dialog-body.component';
import { LcuDataFlowMapElementComponent } from './elements/data-flow-map/data-flow-map.component';
import { DataFlowMapJSPlumbToolkitIOService } from './services/data-flow-map-jsplumb-toolkit-io.service';
import { DialogModuleConfigureComponent } from './elements/data-flow-manager/controls/dialog-module-configure/dialog-module-configure.component';
import { LcuDataFlowSchemaMapElementComponent } from './elements/data-flow-map/controls/data-flow-schema-map/data-flow-schema-map.component';
import { DataFlowTableComponent } from './elements/data-flow-map/controls/data-flow-table/data-flow-table';

@NgModule({
  declarations: [
    LcuDataFlowManagerElementComponent,
    LcuDataFlowListElementComponent,
    LcuDataFlowIdeElementComponent,
    LcuDataFlowModulesBankElementComponent,
    LcuDataFlowAnalyticsElementComponent,
    LcuDataFlowMapElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent,
    DialogModuleConfigureComponent,
    LcuDataFlowSchemaMapElementComponent,
    DataFlowTableComponent
  ],
  entryComponents: [
    LcuDataFlowManagerElementComponent,
    LcuDataFlowListElementComponent,
    LcuDataFlowIdeElementComponent,
    LcuDataFlowModulesBankElementComponent,
    LcuDataFlowAnalyticsElementComponent,
    LcuDataFlowMapElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent,
    DialogModuleConfigureComponent,
    LcuDataFlowSchemaMapElementComponent,
    DataFlowTableComponent
  ],
  exports: [
    LcuDataFlowManagerElementComponent,
    LcuDataFlowListElementComponent,
    LcuDataFlowIdeElementComponent,
    LcuDataFlowModulesBankElementComponent,
    LcuDataFlowAnalyticsElementComponent,
    LcuDataFlowMapElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent,
    DialogModuleConfigureComponent,
    LcuDataFlowSchemaMapElementComponent,
    DataFlowTableComponent
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

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LcuDataFlowModule,
      providers: [
        DataFlowJSPlumbToolkitIOService,
        DataFlowMapJSPlumbToolkitIOService
      ]
    };
  }
}
