import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { LCUElementContext, LcuElementComponent, DataFlow } from '@lcu/common';
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
  public AllowDelete: boolean;

  public DataFlowLists: { activeDataFlows: DataFlow[] };

  public State: DataFlowManagementState;

  @ViewChild('drawer')
  public DataFlowListDrawer: any;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected state: DataFlowManagementStateContext,
    protected dataFlowEventService: DataFlowManagerEventService
  ) {
    super(injector);
    this.AllowDelete = true;

    this.DataFlowLists = { activeDataFlows: [] };

    this.subscriptions = {
      deleteDataFlow: this.deleteDataFlow(),
      deployDataFlow: this.deployDataFlow(),
      saveDataFlow: this.saveDataFlow(),
      setActiveDataFlow: this.setActiveDataFlow(),
      toggleCreationModules: this.toggleCreationModules(),
      toggleIsCreating: this.toggleIsCreating()
    };
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.state.Context.subscribe(async state => {
      this.State = state;
      console.log('Data Flow Manager State: ', this.State);

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
  public AddIoT(): void {
    this.State.Loading = true;

    this.state.AddIoTInfrastructure();
  }

  public ToggleIsCreating(): void {
    this.State.Loading = true;

    this.state.ToggleIsCreating();
  }

  //  Helpers
  protected handleStateChanged() {
    if (JSON.stringify(this.State.DataFlows) !== JSON.stringify(this.DataFlowLists.activeDataFlows)) {
      this.DataFlowLists.activeDataFlows = this.State.DataFlows;
      this.openDataFlowListSideBar();
    }
  }

  protected openDataFlowListSideBar(): void {
    if (this.DataFlowLists && this.DataFlowListDrawer) {
      this.DataFlowListDrawer.open();
    }
  }

  protected deleteDataFlow(): Subscription {
    return this.dataFlowEventService.GetDeleteDataFlowEvent().subscribe(
      (dataFlowLookup: string) => {
        this.State.Loading = true;
        this.state.DeleteDataFlow(dataFlowLookup);
      }
    );
  }

  protected deployDataFlow(): Subscription {
    return this.dataFlowEventService.GetDeployDataFlowEvent().subscribe(
      (dataFlowLookup: string) => {
        this.State.Loading = true;
        this.state.DeployDataFlow(dataFlowLookup);
      }
    );
  }

  protected saveDataFlow(): Subscription {
    return this.dataFlowEventService.GetSaveDataFlowEvent().subscribe(
      (dataFlow: DataFlow) => {
        this.State.Loading = true;
        this.state.SaveDataFlow(dataFlow);
      }
    );
  }

  protected setActiveDataFlow(): Subscription {
    return this.dataFlowEventService.GetSetActiveDataFlowEvent().subscribe(
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

  protected toggleIsCreating(): Subscription {
    return this.dataFlowEventService.GetToggleIsCreatingEvent().subscribe(
      () => {
        this.ToggleIsCreating();
      }
    );
  }
}
