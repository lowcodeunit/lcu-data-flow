import { Injectable, Injector } from '@angular/core';
import { StateContext, Application } from '@lcu/common';
import { DataFlowManagementState } from './data-flow-management.state';
import { DataFlow } from '@lcu/common';

@Injectable({
  providedIn: 'root'
})
export class DataFlowManagementStateContext extends StateContext<DataFlowManagementState> {
  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  API Methods
  public AddIoTInfrastructure() {
    this.Execute({
      Arguments: {},
      Type: 'AddIoTInfrastructure'
    });
  }

  public DeleteDataFlow(dataFlowLookup: string) {
    this.Execute({
      Arguments: {
        DataFlowLookup: dataFlowLookup
      },
      Type: 'DeleteDataFlow'
    });
  }

  public DeployDataFlow(dataFlowLookup: string) {
    this.Execute({
      Arguments: {
        DataFlowLookup: dataFlowLookup
      },
      Type: 'DeployDataFlow'
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

  public ToggleCreationModules() {
    this.Execute({
      Arguments: {},
      Type: 'ToggleCreationModules'
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
    return <DataFlowManagementState>{ Loading: true };
  }

  protected loadStateKey() {
    return 'main';
  }

  protected loadStateName() {
    return 'dataflowmanagement';
  }
}
