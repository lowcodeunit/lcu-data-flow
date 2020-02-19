import { Injectable, EventEmitter } from '@angular/core';
import {
  jsPlumbToolkitIO,
  Surface,
  LayoutSpec,
  jsPlumbToolkit,
  jsPlumbUtil,
  jsPlumbToolkitOptions,
  SurfaceRenderParams,
  Edge,
  Node
} from 'jsplumbtoolkit';
import {
  DataFlow,
  DataFlowOutput,
  DataFlowModule,
  DataFlowModuleOption,
  JSONSchema
} from '@lcu/common';
import { isString } from 'util';
import { AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { DataFlowModuleComponent } from '../elements/data-flow-manager/controls/data-flow-module/data-flow-module.component';
import { DataFlowNodeFactoryParams } from '../models/DataFlowNodeFactoryParams';
import { LCUJSPlumbToolkitIOService } from './lcu-jsplumb-toolkit-io.service';
import {
  SchemaFunctionDefinition,
  DataFlowModuleSchemaConfig,
  SchemaFunctionReturn,
  SchemaFunctionRef,
  DataFlowSchemaMap,
  SchemaFunction,
  SchemaFunctionProperty,
  SchemaNode
} from '../models/DataFlowModuleSchemaConfig';
import { DataFlowTableComponent } from '../elements/data-flow-map/controls/data-flow-table/data-flow-table';

@Injectable({
  providedIn: 'root'
})
export class DataFlowMapJSPlumbToolkitIOService extends LCUJSPlumbToolkitIOService<
  DataFlowModuleSchemaConfig
> {
  // 	Fields

  //  Properties
  public EdgeTapped: EventEmitter<Edge>;

  // 	Constructors
  constructor(protected jsPlumb: jsPlumbService) {
    super(jsPlumb);

    this.EdgeTapped = new EventEmitter();
  }

  // 	API Methods
  public LoadRenderParams(layoutType: string = 'Spring'): SurfaceRenderParams {
    const renderParams = super.LoadRenderParams();

    renderParams.layout = {
      type: 'Absolute',
      parameters: {
        padding: [150],
        orientation: 'vertical'
      }
    };

    return renderParams;
  }

  public LoadToolkitParams(): jsPlumbToolkitOptions {
    const toolkitParams = super.LoadToolkitParams();

    toolkitParams.beforeStartConnect = (node: any, edgeType: string) => {
      return this.beforeStartConnect(node, edgeType);
    };

    return toolkitParams;
  }

  /**
   * Setup view options
   */
  public LoadView(): AngularViewOptions {
    const view = super.LoadView();

    delete view.edges.default.endpoint;
    delete view.edges.default.anchor;
    delete view.edges.default.hoverPaintStyle;
    delete view.edges.default.overlays;

    view.edges.default.endpoints = [
      'Blank',
      ['Image', <any> { src: '/img/gear.png' }]
    ];

    view.edges.default.anchors = ['Right', 'Left'];

    view.ports.target.endpoint = ['Image', <any> { src: '/img/gear.png' }];

    view.edges.default.overlays = [
      [
        'Label',
        {
          cssClass: 'delete-relationship',
          label: '<i class=\'fa fa-times\'></i>',
          events: {
            tap: params => {
              this.EdgeTapped.emit(params.edge);
            }
          },
          location: 0.1
        }
      ]
    ];

    view.edges.default.paintStyle.strokeWidth = 1;
    view.edges.default.paintStyle.outlineWidth = 1;

    return view;
  }

  // public SetViewNodes(
  //   options: any[],
  //   view: AngularViewOptions,
  //   comp: any = DataFlowTableComponent
  // ) {
  //   if (options && view) {
  //     view.nodes = {
  //       parent: this.loadParentNode()
  //     };

  //     if (options) {
  //       options.forEach(option => {
  //         view.nodes[option.ModuleType] = {
  //           parent: 'parent',
  //           component: comp
  //         };
  //       });
  //     }
  //   }
  // }

  // 	Helpers
  protected beforeStartConnect(node: any, edgeType: string) {
    return { label: '' };
  }

  protected exportOutput(toolkit: jsPlumbToolkit, params: {}) {
    const nodes = toolkit.getNodes();
    const edges = toolkit.getAllEdges();
    const returnObj: DataFlowModuleSchemaConfig = new DataFlowModuleSchemaConfig();
    returnObj.SchemaMaps = new Array<DataFlowSchemaMap>();
    returnObj.SchemaNodes = new Array<SchemaNode>();
    returnObj.SchemaFunctions = new Array<SchemaFunctionRef>();
    returnObj.SchemaFunctionReturns = new Array<SchemaFunctionReturn>();
    returnObj.HasErrors = false;

    nodes.forEach(item => {
      const schemaNode: SchemaNode = {
        ID: item.id,
        Data: {},
        JSONSchemaID: item.data.Schema.id,
        IncommingModuleID: '',
        OutgoingModuleIDs: [],
        JoinRelationships: [],
        Groups: [],
        Timestamp: '',
        TumblingWindow: false,
        TumblingInterval: '',
        TumblingIntervalValue: null,
        DisableSchemaEdit: false
      };

      if (item.data.SchemaType === 'incomming' && item.data.IncommingModuleID) {
        schemaNode.IncommingModuleID = item.data.IncommingModuleID;
      } else if (
        item.data.SchemaType === 'outgoing' &&
        item.data.OutgoingModuleIDs
      ) {
        schemaNode.OutgoingModuleIDs = item.data.OutgoingModuleIDs;
      }

      if (item.data.DisableSchemaEdit) {
        schemaNode.DisableSchemaEdit = item.data.DisableSchemaEdit;
      }

      Object.keys(item.data).forEach(key => {
        if (
          key !== 'Schema' &&
          key !== 'IncommingModules' &&
          key !== 'OutgoingModules' &&
          key !== 'IncommingModuleID' &&
          key !== 'OutgoingModuleID' &&
          key !== 'OutgoingModuleIDs' &&
          key !== 'Functions' &&
          key !== 'SchemaFunctionsReturnSource' &&
          key !== 'SchemaFunctionsReturnSourceID' &&
          key !== 'SchemaFunctionsReturnValue' &&
          key !== 'SchemaFunctionsReturnValueType' &&
          key !== 'JoinRelationships' &&
          key !== 'DisableSchemaEdit' &&
          key !== 'ShowJoinLink' &&
          key !== 'Groups' &&
          key !== 'TumblingWindow' &&
          key !== 'TumblingInterval' &&
          key !== 'TumblingIntervalValue' &&
          key !== 'Timestamp' &&
          key !== 'MappingFunctions' &&
          key !== 'JoinFunctionNeeded'
        ) {
          schemaNode.Data[key] = item.data[key];
        }
      });

      if (item.data.Functions && item.data.Functions.length > 0) {
        if (item.data.SchemaFunctionsReturnSourceID) {
          const functionReturn = new SchemaFunctionReturn();

          functionReturn.PropertyID = item.id;
          functionReturn.NodeID = item.data.id;
          functionReturn.SchemaFunctionsReturnSource =
            item.data.SchemaFunctionsReturnSource;
          functionReturn.SchemaFunctionsReturnSourceID =
            item.data.SchemaFunctionsReturnSourceID;
          functionReturn.SchemaFunctionsReturnValue =
            item.data.SchemaFunctionsReturnValue;
          functionReturn.SchemaFunctionsReturnValueType =
            item.data.SchemaFunctionsReturnValueType;
          functionReturn.Type = 'filter';
          functionReturn.ExternalSchemaID = '';

          returnObj.SchemaFunctionReturns.push(functionReturn);
        }

        item.data.Functions.forEach(func => {
          if (func.ExtraData && func.ExtraData.HasErrors) {
            returnObj.HasErrors = true;
          }

          const newFunc: SchemaFunctionRef = {
            ID: func.ID,
            Properties: [],
            Name: func.Name,
            Order: func.Order,
            FunctionID: func.Function.ID,
            ExtraData: func.ExtraData,
            ResultNodeID: item.data.id,
            ResultPropertyID: '',
            ReturnValueType: func.ReturnValueType,
            ReturnTrueSourceID: func.ReturnTrueSourceID,
            ReturnTrueSource: func.ReturnTrueSource,
            ReturnTrueValue: func.ReturnTrueValue,
            ReturnFalseSourceID: func.ReturnFalseSourceID,
            ReturnFalseSource: func.ReturnFalseSource,
            ReturnFalseValue: func.ReturnFalseValue,
            Type: 'filter'
          };

          func.Properties.forEach(prop => {
            newFunc.Properties.push({
              id: prop.Property ? prop.Property.id : null,
              StaticValue: prop.StaticValue,
              StaticValueType: prop.StaticValueType,
              SchemaID: prop.SchemaID,
              Order: prop.Order,
              Source: prop.Source,
              NodeID: prop.NodeID
            });
          });

          returnObj.SchemaFunctions.push(newFunc);
        });
      }

      if (
        item.data.JoinRelationships &&
        Object.keys(item.data.JoinRelationships).length > 0
      ) {
        schemaNode.JoinRelationships = [];

        Object.keys(item.data.JoinRelationships).forEach(key => {
          const nodeRel = item.data.JoinRelationships[key];
          const rel = {
            Key: key,
            Object: { Relationship: nodeRel.Relationship, Order: nodeRel.Order }
          };
          schemaNode.JoinRelationships.push(rel);

          if (nodeRel.SchemaFunctionsReturnSourceID) {
            const functionReturn = new SchemaFunctionReturn();

            functionReturn.PropertyID = item.id;
            functionReturn.NodeID = item.data.id;
            functionReturn.SchemaFunctionsReturnSource =
              nodeRel.SchemaFunctionsReturnSource;
            functionReturn.SchemaFunctionsReturnSourceID =
              nodeRel.SchemaFunctionsReturnSourceID;
            functionReturn.SchemaFunctionsReturnValue =
              nodeRel.SchemaFunctionsReturnValue;
            functionReturn.SchemaFunctionsReturnValueType =
              nodeRel.SchemaFunctionsReturnValueType;
            functionReturn.Type = 'join';
            functionReturn.ExternalSchemaID = key;

            returnObj.SchemaFunctionReturns.push(functionReturn);
          }
          if (nodeRel.Functions) {
            nodeRel.Functions.forEach(func => {
              if (func.ExtraData && func.ExtraData.HasErrors) {
                returnObj.HasErrors = true;
              }

              const newFunc: SchemaFunctionRef = {
                ID: func.ID,
                Properties: [],
                Name: func.Name,
                Order: func.Order,
                FunctionID: func.Function.ID,
                ExtraData: func.ExtraData,
                ResultNodeID: item.data.id,
                ResultPropertyID: key,
                ReturnValueType: func.ReturnValueType,
                ReturnTrueSourceID: func.ReturnTrueSourceID,
                ReturnTrueSource: func.ReturnTrueSource,
                ReturnTrueValue: func.ReturnTrueValue,
                ReturnFalseSourceID: func.ReturnFalseSourceID,
                ReturnFalseSource: func.ReturnFalseSource,
                ReturnFalseValue: func.ReturnFalseValue,
                Type: 'join'
              };

              func.Properties.forEach(prop => {
                newFunc.Properties.push({
                  id: prop.Property ? prop.Property.id : null,
                  StaticValue: prop.StaticValue,
                  StaticValueType: prop.StaticValueType,
                  SchemaID: prop.SchemaID,
                  NodeID: prop.NodeID,
                  Order: prop.Order,
                  Source: prop.Source
                });
              });

              returnObj.SchemaFunctions.push(newFunc);
            });
          }
        });
      }

      if (item.data.JoinFunctionNeeded) {
        returnObj.HasErrors = true;
      }

      if (item.data.Timestamp) {
        schemaNode.Timestamp = item.data.Timestamp;
      }

      if (item.data.Groups) {
        schemaNode.Groups = item.data.Groups;
      }

      if (item.data.TumblingWindow) {
        schemaNode.TumblingWindow = item.data.TumblingWindow;
        schemaNode.TumblingInterval = item.data.TumblingInterval;
        schemaNode.TumblingIntervalValue = item.data.TumblingIntervalValue;
      }

      const portEdges = item.getPorts().filter(port => {
        return (
          toolkit.getAllEdgesFor(port).filter(edge => {
            return edge.target.id === port.id;
          }).length > 0
        );
      });

      if (edges.length === 0 && item.data.SchemaType === 'outgoing') {
        returnObj.HasErrors = true;
      }

      if (
        item.data.SchemaType === 'outgoing' &&
        (!item.data.OutgoingModuleIDs ||
          item.data.OutgoingModuleIDs.length === 0)
      ) {
        returnObj.HasErrors = true;
      }

      if (
        item.data.SchemaType === 'incomming' &&
        !item.data.IncommingModuleID
      ) {
        returnObj.HasErrors = true;
      }

      returnObj.SchemaNodes.push(schemaNode);

      item.getPorts().forEach(port => {
        if (port.data.MappingFunctionNeeded) {
          returnObj.HasErrors = true;
        }
        if (port.data.Functions && port.data.Functions.length > 0) {
          if (port.data.SchemaFunctionsReturnSourceID) {
            const functionReturn = new SchemaFunctionReturn();

            functionReturn.PropertyID = port.id;
            functionReturn.NodeID = item.data.id;
            functionReturn.SchemaFunctionsReturnSource =
              port.data.SchemaFunctionsReturnSource;
            functionReturn.SchemaFunctionsReturnSourceID =
              port.data.SchemaFunctionsReturnSourceID;
            functionReturn.SchemaFunctionsReturnValue =
              port.data.SchemaFunctionsReturnValue;
            functionReturn.SchemaFunctionsReturnValueType =
              port.data.SchemaFunctionsReturnValueType;
            functionReturn.Type = 'mapping';
            functionReturn.ExternalSchemaID = '';

            returnObj.SchemaFunctionReturns.push(functionReturn);
          }

          port.data.Functions.forEach(func => {
            if (func.ExtraData && func.ExtraData.HasErrors) {
              returnObj.HasErrors = true;
            }

            const newFunc: SchemaFunctionRef = {
              ID: func.ID,
              Properties: [],
              Name: func.Name,
              Order: func.Order,
              FunctionID: func.Function.ID,
              ExtraData: func.ExtraData,
              ResultNodeID: item.data.id,
              ResultPropertyID: port.id,
              ReturnValueType: func.ReturnValueType,
              ReturnTrueSourceID: func.ReturnTrueSourceID,
              ReturnTrueSource: func.ReturnTrueSource,
              ReturnTrueValue: func.ReturnTrueValue,
              ReturnFalseSourceID: func.ReturnFalseSourceID,
              ReturnFalseSource: func.ReturnFalseSource,
              ReturnFalseValue: func.ReturnFalseValue,
              Type: 'mapping'
            };

            func.Properties.forEach(prop => {
              newFunc.Properties.push({
                id: prop.Property ? prop.Property.id : null,
                StaticValue: prop.StaticValue,
                StaticValueType: prop.StaticValueType,
                SchemaID: prop.SchemaID,
                NodeID: prop.NodeID,
                Order: prop.Order,
                Source: prop.Source
              });
            });

            returnObj.SchemaFunctions.push(newFunc);
          });
        }
      });
    });

    edges.forEach(item => {
      const edgeData = item.data;

      const schemaMap = <DataFlowSchemaMap> {
        ID: item.data.id,
        IncommingSchemaID: item.source.id,
        OutgoingSchemaID: item.target.id,
        Data: edgeData,
        IncommingPropertyID: item.source.id,
        OutgoingPropertyID: item.target.id
      };

      returnObj.SchemaMaps.push(schemaMap);
    });

    return returnObj;
  }

  protected loadIOName() {
    return 'data-flow-map-output';
  }

  protected recurseJSONSchemaToAddPorts(schema: JSONSchema, node: any) {
    if (!schema.properties) {
      return;
    }

    const keys = Object.keys(schema.properties);

    let portType = 'default';
    if (node.data.SchemaType === 'incomming') {
      portType = 'source';
    } else {
      portType = 'target';
    }

    keys.forEach(key => {
      node.addPort({
        id: schema.properties[key].$id,
        DataType: schema.properties[key].type,
        Text: schema.properties[key].title,
        type: portType,
        MappingFunctionError: false
      });

      if (schema.properties[key].type === 'object') {
        this.recurseJSONSchemaToAddPorts(schema.properties[key].oneOf[0], node);
      }
    });
  }

  protected recurseJSONSchemaToFindProperty(
    schema: JSONSchema,
    id: string
  ): boolean {
    if (!schema.properties) {
      return;
    }

    const keys = Object.keys(schema.properties);

    let found = null;

    keys.forEach(key => {
      if (schema.properties[key].$id === id) {
        found = schema.properties[key];
      } else if (!found && schema.properties[key].type === 'object') {
        found = this.recurseJSONSchemaToFindProperty(
          schema.properties[key].oneOf[0],
          id
        );
      }
    });

    return found;
  }

  protected parseOutput(
    output: DataFlowModuleSchemaConfig,
    toolkit: jsPlumbToolkit,
    params: {
      Schemas: JSONSchema[];
      AvailableSchemaFunctions: SchemaFunctionDefinition[];
      IsJoinFunctionNeeded: (edge: Edge) => boolean;
      IsJoinPresent: (node: Node) => boolean;
      IsMappingFunctionNeeded: (edge: Edge) => boolean;
      IsGroupNeeded: (
        node: any,
        currentFunction: any,
        currentFunctionPort: any
      ) => boolean;
    }
  ) {
    if (output.SchemaNodes) {
      output.SchemaNodes.forEach(item => {
        const node = item.Data;

        const schemaList = params.Schemas.filter(obj => {
          return obj.$id === item.JSONSchemaID;
        });

        if (schemaList && schemaList.length > 0) {
          node.Schema = JSON.parse(JSON.stringify(schemaList[0]));
        }

        node.FilterFunctionError = false;

        if (item.IncommingModuleID) {
          node.IncommingModuleID = item.IncommingModuleID;
        }

        if (item.OutgoingModuleIDs) {
          node.OutgoingModuleIDs = item.OutgoingModuleIDs;
        }

        if (item.DisableSchemaEdit) {
          node.DisableSchemaEdit = item.DisableSchemaEdit;
        }

        if (item.DisableSchemaEdit) {
          node.Schema.sourceTitle = item.Data.Name; // JSON.parse(JSON.stringify(node.Schema.title));
          // node.Schema.title = JSON.parse(JSON.stringify(item.Data.Name));
        }

        if (item.Groups) {
          node.Groups = item.Groups;
        }

        if (item.Timestamp) {
          node.Timestamp = item.Timestamp;
        }

        if (item.TumblingWindow) {
          node.TumblingWindow = item.TumblingWindow;
          node.TumblingInterval = item.TumblingInterval;
          node.TumblingIntervalValue = item.TumblingIntervalValue;
        }

        if (item.JoinRelationships && item.JoinRelationships.length > 0) {
          node.JoinRelationships = {};

          item.JoinRelationships.forEach(rel => {
            node.JoinRelationships[rel.Key] = {};
            node.JoinRelationships[rel.Key].Relationship =
              rel.Object.Relationship;
            node.JoinRelationships[rel.Key].Order = rel.Object.Order;
            node.JoinRelationships[rel.Key].JoinFunctionError = false;
          });
        }

        const newNode = toolkit.addNode(node);

        this.recurseJSONSchemaToAddPorts(node.Schema, newNode);

        setTimeout(() => {
          toolkit.updateNode(newNode.id);
        }, 50);
      });
    }

    setTimeout(() => {
      if (output.SchemaMaps) {
        output.SchemaMaps.forEach(item => {
          const edge = toolkit.addEdge({
            source: item.IncommingSchemaID + '.' + item.IncommingPropertyID,
            target: item.OutgoingSchemaID + '.' + item.OutgoingPropertyID,
            data: item.Data,
            directed: false
          });
        });
      }

      if (output.SchemaFunctions) {
        output.SchemaFunctions.forEach(func => {
          const node = toolkit.getNode(func.ResultNodeID);
          let port;

          if (!func.Type) {
            func.Type = 'mapping';
          }

          if (func.Type === 'mapping') {
            port = node.getPort(func.ResultPropertyID);

            if (!port.data.Functions) {
              port.data.Functions = new Array<SchemaFunction>();
            }
          } else if (func.Type === 'filter') {
            if (!node.data.Functions) {
              node.data.Functions = new Array<SchemaFunction>();
            }
          } else if (func.Type === 'join') {
            if (!node.data.JoinRelationships[func.ResultPropertyID].Functions) {
              node.data.JoinRelationships[
                func.ResultPropertyID
              ].Functions = new Array<SchemaFunction>();
            }
          }

          const newFunc = new SchemaFunction();
          newFunc.ID = func.ID;
          newFunc.Name = func.Name;
          newFunc.Order = func.Order;
          newFunc.ExtraData = func.ExtraData;
          newFunc.ReturnValueType = func.ReturnValueType;
          newFunc.ReturnTrueSource = func.ReturnTrueSource;
          newFunc.ReturnTrueSourceID = func.ReturnTrueSourceID;
          newFunc.ReturnTrueValue = func.ReturnTrueValue;
          newFunc.ReturnFalseSource = func.ReturnFalseSource;
          newFunc.ReturnFalseSourceID = func.ReturnFalseSourceID;
          newFunc.ReturnFalseValue = func.ReturnFalseValue;
          newFunc.Properties = new Array<SchemaFunctionProperty>();

          func.Properties.forEach(prop => {
            if (prop.Source === 'function') {
              const existingFunction = output.SchemaFunctions.filter(f => {
                return f.ID === prop.id;
              })[0];

              const funcDef = params.AvailableSchemaFunctions.filter(item => {
                return item.ID === existingFunction.FunctionID;
              })[0];

              const newExisting = new SchemaFunctionProperty();
              newExisting.Source = prop.Source;
              newExisting.Property = new JSONSchema();
              newExisting.Property.$id = existingFunction.ID;
              newExisting.Property.title = 'Result of ' + existingFunction.Name;
              newExisting.Property.type = funcDef.ReturnType;
              newExisting.Order = prop.Order;
              newExisting.StaticValue = prop.StaticValue;
              newExisting.StaticValueType = prop.StaticValueType;

              newFunc.Properties.push(newExisting);
            } else if (prop.Source === 'static') {
              const newStatic = new SchemaFunctionProperty();
              newStatic.Source = prop.Source;
              newStatic.Order = prop.Order;
              newStatic.StaticValue = prop.StaticValue;
              newStatic.StaticValueType = prop.StaticValueType;
              newStatic.Property = new JSONSchema();
              newStatic.Property.$id = prop.id;

              newFunc.Properties.push(newStatic);
            } else {
              let newProp = null;

              if (prop.id) {
                newProp = this.recurseJSONSchemaToFindProperty(
                  toolkit.getNode(prop.NodeID).data.Schema,
                  prop.id
                );
              }

              newFunc.Properties.push({
                Source: prop.Source,
                Property: newProp,
                SchemaID: prop.SchemaID,
                NodeID: prop.NodeID,
                Order: prop.Order,
                StaticValue: prop.StaticValue,
                StaticValueType: prop.StaticValueType
              });
            }
          });

          newFunc.Function = params.AvailableSchemaFunctions.filter(item => {
            return item.ID === func.FunctionID;
          })[0];

          if (func.Type === 'mapping') {
            port.data.Functions.push(newFunc);
            if (func.ExtraData.HasErrors) {
              port.data.MappingFunctionError = true;
            }
          } else if (func.Type === 'filter') {
            node.data.Functions.push(newFunc);
            if (func.ExtraData.HasErrors) {
              node.data.FilterFunctionError = true;
            }
          } else if (func.Type === 'join') {
            node.data.JoinRelationships[func.ResultPropertyID].Functions.push(
              newFunc
            );
            if (func.ExtraData.HasErrors) {
              node.data.JoinRelationships[
                func.ResultPropertyID
              ].JoinFunctionError = true;
            }
          }
        });
      }

      if (output.SchemaFunctionReturns) {
        output.SchemaFunctionReturns.forEach(ret => {
          const node = toolkit.getNode(ret.NodeID);
          let port;

          if (!ret.Type) {
            ret.Type = 'mapping';
          }

          if (ret.Type === 'mapping') {
            port = node.getPort(ret.PropertyID);

            if (!port.data.SchemaFunctionsReturnSourceID) {
              port.data.SchemaFunctionsReturnSource = null;
              port.data.SchemaFunctionsReturnSourceID = null;
              port.data.SchemaFunctionsReturnValue = null;
              port.data.SchemaFunctionsReturnValueType = null;
            }
            port.data.SchemaFunctionsReturnSource =
              ret.SchemaFunctionsReturnSource;
            port.data.SchemaFunctionsReturnSourceID =
              ret.SchemaFunctionsReturnSourceID;
            port.data.SchemaFunctionsReturnValue =
              ret.SchemaFunctionsReturnValue;
            port.data.SchemaFunctionsReturnValueType =
              ret.SchemaFunctionsReturnValueType;
          } else if (ret.Type === 'filter') {
            if (!node.data.SchemaFunctionsReturnSourceID) {
              node.data.SchemaFunctionsReturnSource = null;
              node.data.SchemaFunctionsReturnSourceID = null;
              node.data.SchemaFunctionsReturnValue = null;
              node.data.SchemaFunctionsReturnValueType = null;
            }
            node.data.SchemaFunctionsReturnSource =
              ret.SchemaFunctionsReturnSource;
            node.data.SchemaFunctionsReturnSourceID =
              ret.SchemaFunctionsReturnSourceID;
            node.data.SchemaFunctionsReturnValue =
              ret.SchemaFunctionsReturnValue;
            node.data.SchemaFunctionsReturnValueType =
              ret.SchemaFunctionsReturnValueType;
          } else if (ret.Type === 'join') {
            if (
              !node.data.JoinRelationships[ret.ExternalSchemaID]
                .SchemaFunctionsReturnSourceID
            ) {
              node.data.JoinRelationships[
                ret.ExternalSchemaID
              ].SchemaFunctionsReturnSource = null;
              node.data.JoinRelationships[
                ret.ExternalSchemaID
              ].SchemaFunctionsReturnSourceID = null;
              node.data.JoinRelationships[
                ret.ExternalSchemaID
              ].SchemaFunctionsReturnValue = null;
              node.data.JoinRelationships[
                ret.ExternalSchemaID
              ].SchemaFunctionsReturnValueType = null;
            }
            node.data.JoinRelationships[
              ret.ExternalSchemaID
            ].SchemaFunctionsReturnSource = ret.SchemaFunctionsReturnSource;
            node.data.JoinRelationships[
              ret.ExternalSchemaID
            ].SchemaFunctionsReturnSourceID = ret.SchemaFunctionsReturnSourceID;
            node.data.JoinRelationships[
              ret.ExternalSchemaID
            ].SchemaFunctionsReturnValue = ret.SchemaFunctionsReturnValue;
            node.data.JoinRelationships[
              ret.ExternalSchemaID
            ].SchemaFunctionsReturnValueType =
              ret.SchemaFunctionsReturnValueType;
            node.data.JoinRelationships[ret.ExternalSchemaID].ExternalSchemaID =
              ret.ExternalSchemaID;
          }
        });
      }

      if (output.SchemaNodes) {
        toolkit
          .getNodes()
          .filter(node => {
            return node.data.SchemaType === 'outgoing';
          })
          .forEach(node => {
            node.data.JoinFunctionNeeded = false;
            node.data.ShowJoinLink = false;

            node.getPorts().forEach(port => {
              const portEdges = toolkit.getAllEdgesFor(port);

              if (node.data.SchemaType === 'outgoing') {
                portEdges.forEach(edge => {
                  const needed = params.IsJoinFunctionNeeded(edge);
                  if (needed && !params.IsJoinPresent(node)) {
                    node.data.JoinFunctionNeeded = true;
                  }
                  if (needed) {
                    node.data.ShowJoinLink = true;
                  }
                });
              }

              if (portEdges && portEdges.length > 0) {
                const edge = portEdges[0];
                const isMapNeeded = params.IsMappingFunctionNeeded(edge);

                if (
                  isMapNeeded &&
                  !edge.target.data.SchemaFunctionsReturnSource
                ) {
                  edge.target.data.MappingFunctionNeeded = true;
                }
              }
            });

            params.IsGroupNeeded(node, null, null);
          });
      }
    }, 500);
  }
}
