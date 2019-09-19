import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FathymSharedModule, MaterialModule } from '@lcu-ide/common';
import { LcuDataFlowDataFlowManagerElementComponent } from './elements/data-flow-manager/data-flow-manager.component';
import { LcuDataFlowDataFlowListElementComponent } from './elements/data-flow-manager/controls/data-flow-list/data-flow-list.component';
import { LcuDataFlowDataFlowIdeElementComponent } from './elements/data-flow-manager/controls/data-flow-ide/data-flow-ide.component';
import { LcuDataFlowDataFlowModulesBankElementComponent } from './elements/data-flow-manager/controls/data-flow-modules-bank/data-flow-modules-bank.component';

@NgModule({
  declarations: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent
  ],
  entryComponents: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent
  ],
  exports: [
    LcuDataFlowDataFlowManagerElementComponent,
    LcuDataFlowDataFlowListElementComponent,
    LcuDataFlowDataFlowIdeElementComponent,
    LcuDataFlowDataFlowModulesBankElementComponent
  ],
  imports: [FathymSharedModule, MaterialModule, FlexLayoutModule, ReactiveFormsModule, FormsModule]
})
export class LcuDataFlowModule {}
