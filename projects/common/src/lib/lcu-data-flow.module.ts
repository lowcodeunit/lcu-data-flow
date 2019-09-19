import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FathymSharedModule, MaterialModule } from '@lcu-ide/common';
import { LcuDataFlowDataFlowManagerElementComponent } from './elements/data-flow-manager/data-flow-manager.component';
import { LcuDataFlowDataFlowListElementComponent } from './elements/data-flow-manager/controls/data-flow-list/data-flow-list.component';
import { LcuDataFlowDataFlowIdeElementComponent } from './elements/data-flow-manager/controls/data-flow-ide/data-flow-ide.component';

@NgModule({
  declarations: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent
  ],
  entryComponents: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent
  ],
  exports: [LcuDataFlowDataFlowManagerElementComponent, LcuDataFlowDataFlowListElementComponent, LcuDataFlowDataFlowIdeElementComponent],
  imports: [FathymSharedModule, MaterialModule, FlexLayoutModule, ReactiveFormsModule, FormsModule]
})
export class LcuDataFlowModule {}
