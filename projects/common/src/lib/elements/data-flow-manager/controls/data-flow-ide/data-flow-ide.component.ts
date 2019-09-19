import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu-ide/common';
import { DataFlow } from '../../../../models/DataFlow';
import { DataFlowManagerState } from '../../../../core/data-flow-manager-state.model';
import { DataFlowManagerStateManagerContext } from '../../../../core/data-flow-manager-state-manager.context';

export class LcuDataFlowDataFlowIdeElementState {}

export class LcuDataFlowDataFlowIdeContext extends LCUElementContext<LcuDataFlowDataFlowIdeElementState> {}

export const SelectorLcuDataFlowDataFlowIdeElement = 'lcu-data-flow-ide-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowIdeElement,
  templateUrl: './data-flow-ide.component.html',
  styleUrls: ['./data-flow-ide.component.scss']
})
export class LcuDataFlowDataFlowIdeElementComponent extends LcuElementComponent<LcuDataFlowDataFlowIdeContext> implements OnInit {
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
  public CancelActive() {
    this.State.Loading = true;

    this.state.SetActiveDataFlow(null);
  }

  //  Helpers
  protected handleStateChanged() {
    this.State.ModuleOptions = [
      {
        Description: 'Test desc',
        Icon: { Icon: 'cloud' },
        Category: 'Test',
        ModuleType: 'TestModule',
        Name: 'Infrastructure'
      },
      {
        Description: 'Test desc',
        Icon: { Icon: 'cloud' },
        Category: 'Test',
        ModuleType: 'TestModule2',
        Name: 'Infrastructure 2.0'
      },
      {
        Description: 'Test desc',
        Icon: { Icon: 'settings' },
        Category: 'Admin',
        ModuleType: 'TestModule3',
        Name: 'OMS'
      },
      {
        Description: 'Test desc',
        Icon: { Icon: 'dashboard' },
        Category: 'Admin',
        ModuleType: 'TestModule4',
        Name: 'Active Directory'
      }
    ];
  }
}
