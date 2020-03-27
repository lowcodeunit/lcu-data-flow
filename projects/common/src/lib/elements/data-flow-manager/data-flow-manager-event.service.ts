import { Injectable, EventEmitter } from '@angular/core';
import { DataFlow } from '@lcu/common';

@Injectable({
  providedIn: 'root'
})
export class DataFlowManagerEventService {
  private loading: EventEmitter<boolean>;

  private addIoTInfrastructure: EventEmitter<any>;
  private deleteDataFlow: EventEmitter<any>;
  private deployDataFlow: EventEmitter<string>;
  private saveDataFlow: EventEmitter<DataFlow>;
  private setActiveDataFlow: EventEmitter<string>;
  private toggleCreationModules: EventEmitter<any>;
  private toggleIsCreating: EventEmitter<any>;

  constructor() {
    this.loading = new EventEmitter<boolean>();

    this.addIoTInfrastructure = new EventEmitter<any>();
    this.deleteDataFlow = new EventEmitter<any>();
    this.deployDataFlow = new EventEmitter<string>();
    this.saveDataFlow = new EventEmitter<DataFlow>();
    this.setActiveDataFlow = new EventEmitter<string>();
    this.toggleCreationModules = new EventEmitter<any>();
    this.toggleIsCreating = new EventEmitter<any>();
  }

  public EmitLoadingEvent(isLoading: boolean): void {
    this.loading.emit(isLoading);
  }

  public GetLoadingEvent(): EventEmitter<boolean> {
    return this.loading;
  }



  public EmitDeployDataFlowEvent(lookup: string): void {
    this.deployDataFlow.emit(lookup);
  }

  public GetDeployDataFlowEvent(): EventEmitter<string> {
    return this.deployDataFlow;
  }

  public EmitActiveDataFlowEvent(dataFlowLookup: string): void {
    this.setActiveDataFlow.emit(dataFlowLookup);
  }

  public GetActiveDataFlowEvent(): EventEmitter<string> {
    return this.setActiveDataFlow;
  }

  public EmitSaveDataFlowEvent(dataFlow: DataFlow): void {
    this.saveDataFlow.emit(dataFlow);
  }

  public GetSaveDataFlowEvent(): EventEmitter<DataFlow> {
    return this.saveDataFlow;
  }

  public EmitToggleCreationModulesEvent(): void {
    this.toggleCreationModules.emit();
  }

  public GetToggleCreationModulesEvent(): EventEmitter<any> {
    return this.toggleCreationModules;
  }

  /***

  public EmitEvent(value: any): void {
    this.event.emit(value);
  }

  public GetEvent(): EventEmitter<any> {
    return this.event;
  }

  ***/


}
