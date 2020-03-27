import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { LcuDataFlowDataFlowListContext } from './controls/data-flow-list/data-flow-list.component';
import { DataFlowManagementStateContext } from '../../core/data-flow-management-state.context';
import { DataFlowManagementState } from '../../core/data-flow-management.state';

export class LcuDataFlowDataFlowManagerElementState {}

export class LcuDataFlowDataFlowManagerContext extends LCUElementContext<LcuDataFlowDataFlowManagerElementState> {}

export const SelectorLcuDataFlowDataFlowManagerElement = 'lcu-data-flow-manager-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowManagerElement,
  templateUrl: './data-flow-manager.component.html',
  styleUrls: ['./data-flow-manager.component.scss']
})
export class LcuDataFlowDataFlowManagerElementComponent extends LcuElementComponent<LcuDataFlowDataFlowManagerContext> implements OnInit {
  //  Fields

  //  Properties
  public State: DataFlowManagementState;

  //  Constructors
  constructor(protected injector: Injector, protected state: DataFlowManagementStateContext) {
    super(injector);
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.state.Context.subscribe(state => {
      this.State = state;

      this.handleStateChanged();
    });
  }

  //  API Methods
  public AddIoT() {
    this.State.Loading = true;

    this.state.AddIoTInfrastructure();
  }

  //  Helpers
  protected handleStateChanged() {
  }
}
