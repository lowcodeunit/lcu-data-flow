import { Application, DAFViewApplicationConfig } from '@lcu-ide/common';
import { DataFlow } from '../models/DataFlow';
import { DataFlowModuleOption } from './../models/DataFlowModuleOption';

export class DataFlowManagerState {
  public ActiveDataFlow?: DataFlow;

  public DataFlows?: DataFlow[];

  public EnvironmentLookup?: boolean;

  public IsCreating?: boolean;

  public Loading?: boolean;

  public ModuleOptions?: DataFlowModuleOption[];
}
