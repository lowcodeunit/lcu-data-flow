import { JSONSchema } from '@lcu/common';

export class DataFlowModuleSchemaConfig {
  public SchemaFunctions: SchemaFunctionRef[];

  public SchemaMaps: DataFlowSchemaMap[];

  public SchemaNodes: SchemaNode[];

  public SchemaFunctionReturns: SchemaFunctionReturn[];

  public HasErrors: boolean;
}

export class DataFlowSchemaMap {
  public Active: boolean;

  public Data: any;

  public Description: string;

  public ID: string;

  public IncommingSchemaID: string;

  public IncommingPropertyID: string;

  public Lookup: string;

  public Name: string;

  public OutgoingSchemaID: string;

  public OutgoingPropertyID: string;

  public Schema: JSONSchema;
}

export class SchemaFunctionReturn {
  public ExternalSchemaID: string;

  public NodeID: string;

  public PropertyID: string;

  public SchemaFunctionsReturnSourceID: string;

  public SchemaFunctionsReturnSource: string;

  public SchemaFunctionsReturnValue: string;

  public SchemaFunctionsReturnValueType: string;

  public Type: string;
}

export class SchemaNode {
  public ID: string;

  public Data: any;

  public DisableSchemaEdit: boolean;

  public Groups: string[];

  public IncommingModuleID: string;

  public JoinRelationships: any[];

  public JSONSchemaID: string;

  public OutgoingModuleIDs: string[];

  public Timestamp: string;

  public TumblingWindow: boolean;

  public TumblingInterval: string;

  public TumblingIntervalValue: number;
}

export class SchemaFunctionDefinition {
  public AllowedIncommingTypes: string[];

  public AllowDifferentIncommingTypes: boolean;

  public AllowMultipleIncomming: boolean;

  public Description: string;

  public FunctionType: string;

  public ID: string;

  public Lookup: string;

  public MaxProperties: number;

  public MinProperties: number;

  public Name: string;

  public ReturnType: string;
}

export class SchemaFunctionProperty {
  public FullPropertyName?: string;

  public Order: number;

  public Property: JSONSchema;

  public SchemaID?: string;

  public NodeID: string;

  public Source: string;

  public StaticValue?: any;

  public StaticValueType?: string;
}

export class SchemaFunction {
  public ID: string;

  public ExtraData: any;

  public Function: SchemaFunctionDefinition;

  public Name: string;

  public Order: number;

  public Properties: SchemaFunctionProperty[];

  public ReturnTrueSource: string;

  public ReturnTrueSourceID: string;

  public ReturnTrueValue: string;

  public ReturnFalseSource: string;

  public ReturnFalseSourceID: string;

  public ReturnFalseValue: string;

  public ReturnValueType: string;
}

export class SchemaFunctionRef {
  public ExtraData: any;

  public FunctionID: string;

  public ID: string;

  public Name: string;

  public Order: number;

  public Properties: any[];

  public ResultPropertyID: string;

  public ResultNodeID: string;

  public ReturnFalseSource: string;

  public ReturnFalseSourceID: string;

  public ReturnFalseValue: string;

  public ReturnTrueSource: string;

  public ReturnTrueSourceID: string;

  public ReturnTrueValue: string;

  public ReturnValueType: string;

  public Type: string;
}
