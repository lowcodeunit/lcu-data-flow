import { NgModule } from '@angular/core';
import { FathymSharedModule } from '@lcu-ide/common';
import { LcuDataFlowDataFlowManagerElementComponent } from './elements/data-flow-manager/data-flow-manager.component';



@NgModule({
  declarations: [
    LcuDataFlowDataFlowManagerElementComponent
  ],
  entryComponents: [
    LcuDataFlowDataFlowManagerElementComponent
  ],
  exports: [
    LcuDataFlowDataFlowManagerElementComponent
  ],
  imports: [
    FathymSharedModule
  ]
})
export class LcuDataFlowModule { }
