import { Application, DAFViewApplicationConfig } from '@lcu-ide/common';
import { DataFlow } from '../models/data-flow';

export class DataFlowManagerState {
  public ActiveDataFlow?: DataFlow;

  public DataFlows?: DataFlow[];

  public Loading?: boolean;
}
