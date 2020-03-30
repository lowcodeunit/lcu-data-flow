import { Injectable, EventEmitter } from '@angular/core';
import { DataFlow } from '@lcu/common';

@Injectable({
  providedIn: 'root'
})
export class DataFlowManagerEventService {
  private deleteDataFlow: EventEmitter<string>;
  private deployDataFlow: EventEmitter<string>;
  private saveDataFlow: EventEmitter<DataFlow>;
  private setActiveDataFlow: EventEmitter<string>;
  private toggleCreationModules: EventEmitter<any>;
  private toggleIsCreating: EventEmitter<any>;

  constructor() {
    this.deleteDataFlow = new EventEmitter<string>();
    this.deployDataFlow = new EventEmitter<string>();
    this.saveDataFlow = new EventEmitter<DataFlow>();
    this.setActiveDataFlow = new EventEmitter<string>();
    this.toggleCreationModules = new EventEmitter<any>();
    this.toggleIsCreating = new EventEmitter<any>();
  }

  /** DeleteDataFlow */
  public EmitDeleteDataFlowEvent(dataFlowLookup: string): void {
    this.deleteDataFlow.emit(dataFlowLookup);
  }

  public GetDeleteDataFlowEvent(): EventEmitter<string> {
    return this.deleteDataFlow;
  }

  /** DeployDataFlow */
  public EmitDeployDataFlowEvent(dataFlowLookup: string): void {
    this.deployDataFlow.emit(dataFlowLookup);
  }

  public GetDeployDataFlowEvent(): EventEmitter<string> {
    return this.deployDataFlow;
  }

  /** SaveDataFlow */
  public EmitSaveDataFlowEvent(dataFlow: DataFlow): void {
    this.saveDataFlow.emit(dataFlow);
  }

  public GetSaveDataFlowEvent(): EventEmitter<DataFlow> {
    return this.saveDataFlow;
  }

  /** SetActiveDataFlow */
  public EmitSetActiveDataFlowEvent(dataFlowLookup: string): void {
    this.setActiveDataFlow.emit(dataFlowLookup);
  }

  public GetSetActiveDataFlowEvent(): EventEmitter<string> {
    return this.setActiveDataFlow;
  }

  /** ToggleCreationModules */
  public EmitToggleCreationModulesEvent(): void {
    this.toggleCreationModules.emit();
  }

  public GetToggleCreationModulesEvent(): EventEmitter<any> {
    return this.toggleCreationModules;
  }

  /** ToggleIsCreating */
  public EmitToggleIsCreatingEvent(): void {
    this.toggleIsCreating.emit();
  }

  public GetToggleIsCreatingEvent(): EventEmitter<any> {
    return this.toggleIsCreating;
  }
}
