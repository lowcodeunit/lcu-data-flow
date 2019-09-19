import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu-ide/common';
import { LcuDataFlowDataFlowListContext } from './controls/data-flow-list/data-flow-list.component';
import { DataFlowManagerStateManagerContext } from '../../core/data-flow-manager-state-manager.context';
import { DataFlowManagerState } from '../../core/data-flow-manager-state.model';

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

  //  Helpers
  protected handleStateChanged() {

  }
}
