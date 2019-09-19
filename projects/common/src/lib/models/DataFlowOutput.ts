import { DataFlowAction } from './DataFlowAction';
import { DataFlowModuleOption } from './DataFlowModuleOption';
import { DataFlowStream } from './DataFlowStream';
import { DataFlowModule } from './DataFlowModule';

export class DataFlowOutput {
  public Modules: DataFlowModule[];

  public Streams: DataFlowStream[];
}
