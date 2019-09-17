import { Injectable, Injector } from '@angular/core';
import { StateManagerContext, Application, DAFViewApplicationConfig } from '@lcu-ide/common';
import { DataFlowManagerState } from './data-flow-manager-state.model';

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
  // public ToggleAddingApp() {
  //   this.Execute({
  //     Arguments: {},
  //     Type: 'toggle-adding-app'
  //   });
  // }

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
