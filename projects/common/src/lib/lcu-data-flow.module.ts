import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  QuestionNodeComponent,
  ActionNodeComponent,
  StartNodeComponent,
  OutputNodeComponent
} from './elements/data-flow-manager/controls/data-flow-module/data-flow-module.component';

@NgModule({
  declarations: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    QuestionNodeComponent,
    ActionNodeComponent,
    StartNodeComponent,
    OutputNodeComponent
  ],
  entryComponents: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    QuestionNodeComponent,
    ActionNodeComponent,
    StartNodeComponent,
    OutputNodeComponent
  ],
  exports: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent,
    QuestionNodeComponent,
    ActionNodeComponent,
    StartNodeComponent,
    OutputNodeComponent
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
}
