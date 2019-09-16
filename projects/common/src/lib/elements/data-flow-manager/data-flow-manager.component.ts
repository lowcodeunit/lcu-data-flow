import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu-ide/common';

export class LcuDataFlowDataFlowManagerElementState {}

export class LcuDataFlowDataFlowManagerContext extends LCUElementContext<LcuDataFlowDataFlowManagerElementState> {}

export const SelectorLcuDataFlowDataFlowManagerElement = 'lcu-data-flow-data-flow-manager-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowManagerElement,
  templateUrl: './data-flow-manager.component.html',
  styleUrls: ['./data-flow-manager.component.scss']
})
export class LcuDataFlowDataFlowManagerElementComponent extends LcuElementComponent<LcuDataFlowDataFlowManagerContext> implements OnInit {
  //  Fields

  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();
  }

  //  API Methods

  //  Helpers
}
