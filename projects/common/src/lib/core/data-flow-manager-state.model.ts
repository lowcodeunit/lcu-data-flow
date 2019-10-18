import { DataFlow, DataFlowModuleDisplay, DataFlowModuleOption, DataFlowModulePack } from '@lcu/common';

export class DataFlowManagerState {
  public ActiveDataFlow?: DataFlow;

  public AllowCreationModules?: boolean;

  public DataFlows?: DataFlow[];

  public EnvironmentLookup?: boolean;

  public IsCreating?: boolean;

  public Loading?: boolean;

  public ModuleDisplays?: DataFlowModuleDisplay[];

  public ModulePacks?: DataFlowModulePack[];

  public ModuleOptions?: DataFlowModuleOption[];
}
