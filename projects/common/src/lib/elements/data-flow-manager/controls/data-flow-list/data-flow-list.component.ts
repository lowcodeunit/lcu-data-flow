import { Component, OnInit, Injector, Input } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu-ide/common';
import { DataFlow } from '../../../../models/data-flow';

export class LcuDataFlowDataFlowListElementState {
  public DataFlows: DataFlow[];
}

export class LcuDataFlowDataFlowListContext extends LCUElementContext<LcuDataFlowDataFlowListElementState> {}

export const SelectorLcuDataFlowDataFlowListElement = 'lcu-data-flow-data-flow-list-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowListElement,
  templateUrl: './data-flow-list.component.html',
  styleUrls: ['./data-flow-list.component.scss']
})
export class LcuDataFlowDataFlowListElementComponent extends LcuElementComponent<LcuDataFlowDataFlowListContext> implements OnInit {
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
  public CreateNewDataFlow() {}

  public SetAcitveDataFlow(dataFlow: DataFlow) {}

  //  Helpers
}
