import { Injectable, Injector } from '@angular/core';
import { StateManagerContext, Application, DAFViewApplicationConfig } from '@lcu-ide/common';
import { DataFlowManagerState } from './data-flow-manager-state.model';
import { DataFlow } from '../models/DataFlow';

@Injectable({
  providedIn: 'root'
})
export class DataFlowManagerStateManagerContext extends StateManagerContext<DataFlowManagerState> {
  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  API Methods
  public DeleteDataFlow(dataFlowLookup: string) {
    this.Execute({
      Arguments: {
        DataFlowLookup: dataFlowLookup
      },
      Type: 'DeleteDataFlow'
    });
  }

  public SaveDataFlow(dataFlow: DataFlow) {
    this.Execute({
      Arguments: {
        DataFlow: dataFlow
      },
      Type: 'SaveDataFlow'
    });
  }

  public SetActiveDataFlow(dataFlowLookup: string) {
    this.Execute({
      Arguments: {
        DataFlowLookup: dataFlowLookup
      },
      Type: 'SetActiveDataFlow'
    });
  }

  public ToggleIsCreating() {
    this.Execute({
      Arguments: {},
      Type: 'ToggleIsCreating'
    });
  }

  //  Helpers
  protected defaultValue() {
    return <DataFlowManagerState>{ Loading: true };
  }

  protected async loadStateKey() {
    return 'main';
  }

  protected async loadStateName() {
    return 'data-flow-manager';
  }
}
