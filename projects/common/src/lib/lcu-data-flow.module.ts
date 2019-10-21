import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { Dialogs } from 'jsplumbtoolkit';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { jsPlumbToolkitDragDropModule } from 'jsplumbtoolkit-angular-drop';

import { LcuDataFlowDataFlowManagerElementComponent } from './elements/data-flow-manager/data-flow-manager.component';
import { LcuDataFlowDataFlowListElementComponent } from './elements/data-flow-manager/controls/data-flow-list/data-flow-list.component';
import { LcuDataFlowDataFlowIdeElementComponent } from './elements/data-flow-manager/controls/data-flow-ide/data-flow-ide.component';
import { LcuDataFlowDataFlowModulesBankElementComponent } from './elements/data-flow-manager/controls/data-flow-modules-bank/data-flow-modules-bank.component';
import {
  DataFlowModuleComponent
} from './elements/data-flow-manager/controls/data-flow-module/data-flow-module.component';
import { DataFlowJSPlumbToolkitIOService } from './services/data-flow-jsplumb-toolkit-io.service';
import { LcuDataFlowDataFlowAnalyticsElementComponent } from './elements/data-flow-analytics/data-flow-analytics.component';
import { DialogBodyComponent } from './elements/data-flow-manager/controls/dialog-body/dialog-body.component';

@NgModule({
  declarations: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    LcuDataFlowDataFlowAnalyticsElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent
  ],
  entryComponents: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    LcuDataFlowDataFlowAnalyticsElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent
  ],
  exports: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    LcuDataFlowDataFlowAnalyticsElementComponent,
    DataFlowModuleComponent,
    DialogBodyComponent
  ],
  imports: [
    FathymSharedModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    jsPlumbToolkitModule,
    jsPlumbToolkitDragDropModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LcuDataFlowModule {
  constructor() {
    Dialogs.initialize({
      selector: '.dlg'
    });
  }

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LcuDataFlowModule,
      providers: [ DataFlowJSPlumbToolkitIOService ]
    }
  }
}
