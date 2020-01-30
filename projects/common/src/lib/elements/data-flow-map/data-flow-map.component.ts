import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagerState } from '../../core/data-flow-manager-state.model';
import { DataFlowManagerStateManagerContext } from '../../core/data-flow-manager-state-manager.context';

export class LcuDataFlowDataFlowMapElementState {}

export class LcuDataFlowDataFlowMapContext extends LCUElementContext<LcuDataFlowDataFlowMapElementState> {}

export const SelectorLcuDataFlowDataFlowMapElement = 'lcu-data-flow-data-flow-map-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowMapElement,
  templateUrl: './data-flow-map.component.html',
  styleUrls: ['./data-flow-map.component.scss']
})
export class LcuDataFlowDataFlowMapElementComponent extends LcuElementComponent<LcuDataFlowDataFlowMapContext> implements OnInit {
  //  Fields

  //  Properties
  public State: DataFlowManagerState;

  //  Constructors
  constructor(protected injector: Injector, protected state: DataFlowManagerStateManagerContext) {
    super(injector);
    console.log('aksljdflasjdflkjasdlfkjadslfkjdlds');
    debugger;
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.state.Context.subscribe(async state => {
      this.State = state;

      await this.handleStateChanged();
    });
  }

  //  API Methods

  //  Helpers
  protected async handleStateChanged() {
    if (this.State) {
     console.log('state', this.State);
    }
  }
}
