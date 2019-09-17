import { NgModule } from '@angular/core';
import { FathymSharedModule } from '@lcu-ide/common';
import { LcuDataFlowDataFlowManagerElementComponent } from './elements/data-flow-manager/data-flow-manager.component';
import { LcuDataFlowDataFlowListElementComponent } from './elements/data-flow-manager/controls/data-flow-list/data-flow-list.component';

@NgModule({
  declarations: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent
  ],
  entryComponents: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent
  ],
  exports: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent
  ],
  imports: [
    FathymSharedModule
  ]
})
export class LcuDataFlowModule { }
