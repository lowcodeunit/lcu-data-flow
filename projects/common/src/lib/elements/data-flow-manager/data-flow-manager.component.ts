import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu-ide/common';
import { LcuDataFlowDataFlowListContext } from './controls/data-flow-list/data-flow-list.component';

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
  public DataFlowList: LcuDataFlowDataFlowListContext;

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.DataFlowList = {
      State: {
        DataFlows: [
          {
            Name: 'Test',
            Description: 'Testing',
            EnterpriseAPIKey: 'xxx',
            Lookup: 'test'
          }
        ]
      }
    };
  }

  //  API Methods

  //  Helpers
}
