import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { LcuDataFlowListContext } from './controls/data-flow-list/data-flow-list.component';
import { DataFlowManagerStateManagerContext } from '../../core/data-flow-manager-state-manager.context';
import { DataFlowManagerState } from '../../core/data-flow-manager-state.model';

export class LcuDataFlowManagerElementState {}

export class LcuDataFlowManagerContext extends LCUElementContext<LcuDataFlowManagerElementState> {}

export const SelectorLcuDataFlowManagerElement = 'lcu-data-flow-manager-element';

@Component({
  selector: SelectorLcuDataFlowManagerElement,
  templateUrl: './data-flow-manager.component.html',
  styleUrls: ['./data-flow-manager.component.scss']
})
export class LcuDataFlowManagerElementComponent extends LcuElementComponent<LcuDataFlowManagerContext> implements OnInit {
  //  Fields

  //  Properties
  public State: DataFlowManagerState;

  //  Constructors
  constructor(protected injector: Injector, protected state: DataFlowManagerStateManagerContext) {
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
