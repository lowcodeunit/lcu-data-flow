import { Injectable, EventEmitter } from '@angular/core';
import {
  jsPlumbToolkitIO,
  Surface,
  LayoutSpec,
  jsPlumbToolkit,
  Dialogs,
  jsPlumbUtil,
  jsPlumbToolkitOptions,
  SurfaceRenderParams
} from 'jsplumbtoolkit';
import { DataFlow, DataFlowOutput, DataFlowModule, DataFlowModuleOption } from '@lcu/common';
import { isString } from 'util';
import { AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { DataFlowModuleComponent } from '../elements/data-flow-manager/controls/data-flow-module/data-flow-module.component';
import { DataFlowNodeFactoryParams } from '../models/DataFlowNodeFactoryParams';
import { LCUJSPlumbToolkitIOService } from './lcu-jsplumb-toolkit-io.service';

@Injectable({
  providedIn: 'root'
})
export class DataFlowJSPlumbToolkitIOService extends LCUJSPlumbToolkitIOService<DataFlowOutput> {
  // 	Fields

  //  Properties

  // 	Constructors
  constructor(protected jsPlumb: jsPlumbService) {
    super(jsPlumb);
  }

  // 	API Methods
  public LoadRenderParams(layoutType: string = 'Spring'): SurfaceRenderParams {
    const renderParams = super.LoadRenderParams();

    renderParams.layout.type = layoutType || renderParams.layout.type;

    return renderParams;
  }

  public LoadToolkitParams(): jsPlumbToolkitOptions {
    const toolkitParams = super.LoadToolkitParams();

    toolkitParams.beforeStartConnect = (node: any, edgeType: string) => {
      return this.beforeStartConnect(node, edgeType);
    };

    return toolkitParams;
  }

  public LoadView(): AngularViewOptions {
    const view = super.LoadView();

    view.edges.default.connector = ['Flowchart', { cornerRadius: 5, anchors: ['Bottom', 'Top'] }];

    return view;
  }

  public SetViewNodes(options: DataFlowModuleOption[], view: AngularViewOptions, comp: any = DataFlowModuleComponent) {
    if (options && view) {
      view.nodes = {
        parent: this.loadParentNode()
      };

      if (options) {
        options.forEach(option => {
          view.nodes[option.ModuleType] = {
            parent: 'parent',
            component: comp
          };
        });
      }
    }
  }

  // 	Helpers
  protected beforeStartConnect(node: any, edgeType: string) {
    return { label: '' };
  }

  protected exportOutput(toolkit: jsPlumbToolkit, params: {}) {
    const nodes = toolkit.getNodes();

    const edges = toolkit.getAllEdges();

    const output: DataFlowOutput = {
      Modules: [],
      Streams: []
    };

    nodes.forEach(item => {
      const mdl: DataFlowModule = {
        ID: item.id,
        Text: item.data.name,
        Display: item.data.Display,
        Deleted: item.data.Deleted,
        Status: item.data.Status
      };

      mdl.Display.Left = item.data.left;

      mdl.Display.Top = item.data.top;

      mdl.Display.Width = item.data.w;

      mdl.Display.Height = item.data.h;

      output.Modules.push(mdl);
    });

    edges.forEach(item => {
      output.Streams.push({
        ID: item.data.id,
        InputModuleID: item.source.id,
        OutputModuleID: item.target.id,
        Title: item.data.label
      });
    });

    return output;
  }

  protected loadParserName() {
    return 'data-flow-output';
  }

  protected parseOutput(output: DataFlowOutput, toolkit: jsPlumbToolkit, params: {}) {
    if (output) {
      toolkit.clear();

      output.Modules.filter(item => {
        return !item.Deleted;
      }).forEach(item => {
        const jspItem = {
          ...item,
          id: item.ID,
          name: item.Text,
          type: item.Display.ModuleType,
          left: item.Display.Left,
          top: item.Display.Top,
          w: item.Display.Width,
          h: item.Display.Height
        };

        toolkit.addNode(jspItem);
      });

      output.Streams.forEach(item => {
        toolkit.addEdge({
          source: item.InputModuleID,
          target: item.OutputModuleID,
          data: {
            id: item.ID,
            label: item.Title,
            type: 'connection'
          }
        });
      });
    }
  }
}
