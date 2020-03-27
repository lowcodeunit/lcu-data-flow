import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { LCUElementContext, LcuElementComponent, DataFlow } from '@lcu/common';
import { LcuDataFlowDataFlowListContext } from './controls/data-flow-list/data-flow-list.component';
import { DataFlowManagementStateContext } from '../../core/data-flow-management-state.context';
import { DataFlowManagementState } from '../../core/data-flow-management.state';
import { DataFlowManagerEventService } from './data-flow-manager-event.service';
import { Subscription } from 'rxjs/internal/Subscription';

export class LcuDataFlowDataFlowManagerElementState {}

export class LcuDataFlowDataFlowManagerContext extends LCUElementContext<LcuDataFlowDataFlowManagerElementState> {}

export const SelectorLcuDataFlowDataFlowManagerElement = 'lcu-data-flow-manager-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowManagerElement,
  templateUrl: './data-flow-manager.component.html',
  styleUrls: ['./data-flow-manager.component.scss']
})
export class LcuDataFlowDataFlowManagerElementComponent extends LcuElementComponent<LcuDataFlowDataFlowManagerContext> implements OnInit, OnDestroy {
  //  Fields
  protected subscriptions: { [key: string]: Subscription };

  //  Properties
  public State: DataFlowManagementState;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected state: DataFlowManagementStateContext,
    protected dataFlowEventService: DataFlowManagerEventService
  ) {
    super(injector);

    this.subscriptions = {
      deployDataFlow: this.deployDataFlow(),
      saveDataFlow: this.saveDataFlow(),
      setActiveDataFlow: this.setActiveDataFlow(),
      toggleCreationModules: this.toggleCreationModules()
    };
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.state.Context.subscribe(async state => {
      this.State = state;

      await this.handleStateChanged();
    });
  }

  public ngOnDestroy() {
    for (const key in this.subscriptions) {
      if (this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();

        delete this.subscriptions[key];
      }
    }
  }

  //  API Methods
  public AddIoT() {
    this.State.Loading = true;

    this.state.AddIoTInfrastructure();
  }

  //  Helpers
  protected handleStateChanged() { }

  protected deployDataFlow(): Subscription {
    return this.dataFlowEventService.GetDeployDataFlowEvent().subscribe(
      (lookup: string) => {
        this.State.Loading = true;
        this.state.DeployDataFlow(lookup);
      }
    );
  }

  protected saveDataFlow(): Subscription {
    return this.dataFlowEventService.GetSaveDataFlowEvent().subscribe(
      (dataFlow: DataFlow) => {
        console.log('GetSaveDataFlowEvent() triggered');
        this.State.Loading = true;
        this.state.SaveDataFlow(dataFlow);
      }
    );
  }

  protected setActiveDataFlow(): Subscription {
    return this.dataFlowEventService.GetActiveDataFlowEvent().subscribe(
      (dataFlowLookup: string) => {
        this.State.Loading = true;
        this.state.SetActiveDataFlow(dataFlowLookup);
      }
    );
  }

  protected toggleCreationModules(): Subscription {
    return this.dataFlowEventService.GetToggleCreationModulesEvent().subscribe(
      () => {
        this.State.Loading = true;
        this.state.ToggleCreationModules();
      }
    );
  }
}
