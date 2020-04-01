import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  jsPlumbToolkitIO,
  Surface,
  LayoutSpec,
  jsPlumbToolkit,
  jsPlumbUtil,
  jsPlumbToolkitOptions,
  SurfaceRenderParams,
  Node,
  Port,
  Group
} from 'jsplumbtoolkit';
import {
  DataFlow,
  DataFlowOutput,
  DataFlowModule,
  DataFlowModuleOption
} from '@lcu/common';
import { isString } from 'util';
import { AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { DataFlowModuleComponent } from '../elements/data-flow-manager/controls/data-flow-module/data-flow-module.component';
import { LCUJSPlumbToolkitIOService } from './lcu-jsplumb-toolkit-io.service';

@Injectable({
  providedIn: 'root'
})
export class DataFlowJSPlumbToolkitIOService extends LCUJSPlumbToolkitIOService<
  DataFlowOutput
> {
  // 	Fields

  //  Properties

  // 	Constructors
  constructor(
    protected jsPlumb: jsPlumbService,
    protected snackBar: MatSnackBar
  ) {
    super(jsPlumb);
  }

  // 	API Methods
  public LoadRenderParams(layoutType: string = 'Spring'): SurfaceRenderParams {
    const renderParams = super.LoadRenderParams();

    renderParams.layout.type = layoutType || renderParams.layout.type;

    return renderParams;
  }

  public LoadToolkitParamsWithOptions(
    options: DataFlowModuleOption[],
    toolkitLookup: () => jsPlumbToolkit
  ): jsPlumbToolkitOptions {
    const toolkitParams = super.LoadToolkitParams();

    toolkitParams.beforeConnect = (
      source: Node | Port | Group,
      target: Node | Port | Group,
      data: object
    ): boolean => {
      return this.beforeConnect(source, target, data, options, toolkitLookup);
    };

    toolkitParams.beforeStartConnect = (
      node: Node | Port | Group,
      edgeType: string
    ) => {
      return this.beforeStartConnect(node, edgeType, options, toolkitLookup);
    };

    return toolkitParams;
  }

  public LoadView(): AngularViewOptions {
    const view = super.LoadView();

    view.edges.default.connector = [
      'Flowchart',
      { cornerRadius: 5, anchors: ['Bottom', 'Top'] }
    ];

    return view;
  }

  public SetViewNodes(
    options: DataFlowModuleOption[],
    view: AngularViewOptions,
    comp: any = DataFlowModuleComponent
  ) {
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
  protected beforeConnect(
    source: Node | Port | Group,
    target: Node | Port | Group,
    data: object,
    options: DataFlowModuleOption[],
    toolkitLookup: () => jsPlumbToolkit
  ): boolean {
    const toolkit = toolkitLookup();

    const targetEdges = toolkit
      .getAllEdgesFor(target)
      .filter(edge => edge.target.id === target.id);

    console.log(`Before Connect: ${source.data.type} => ${target.data.type}`);

    targetEdges.forEach(e =>
      console.log(`${e.source.data.type} => ${e.target.data.type}`)
    );

    const sourceModuleOption = options.find(
      opt => opt.ModuleType === source.data.type
    );

    const targetModuleOption = options.find(
      opt => opt.ModuleType === target.data.type
    );

    if (
      targetModuleOption.IncomingConnectionLimit >= 0 &&
      targetEdges.length >= targetModuleOption.IncomingConnectionLimit
    ) {
      this.openSnackBar(`No more incoming connections allowed for ${target.data.type}`);

      return false;
    }

    if (
      targetModuleOption.IncomingConnectionTypes &&
      targetModuleOption.IncomingConnectionTypes.length > 0 &&
      !targetModuleOption.IncomingConnectionTypes.find(
        ict => ict === source.data.type
      )
    ) {
      this.openSnackBar(
        `The ${source.data.type} cannot connect to the ${target.data.type}`
      );

      return false;
    }

    if (
      sourceModuleOption.OutgoingConnectionTypes &&
      sourceModuleOption.OutgoingConnectionTypes.length > 0 &&
      !sourceModuleOption.OutgoingConnectionTypes.find(
        ict => ict === target.data.type
      )
    ) {
      this.openSnackBar(
        `The ${source.data.type} cannot connect to the ${target.data.type}`
      );

      return false;
    }

    return true;
  }

  protected beforeStartConnect(
    node: Node | Port | Group,
    edgeType: string,
    options: DataFlowModuleOption[],
    toolkitLookup: () => jsPlumbToolkit
  ) {
    const toolkit = toolkitLookup();

    const moduleOption = options.find(opt => opt.ModuleType === node.data.type);

    const edges = toolkit
      .getAllEdgesFor(node)
      .filter(edge => edge.source.id === node.id);

    console.log(`Before Start Connect: ${node.data.type}`);

    edges.forEach(e =>
      console.log(`${e.source.data.type} => ${e.target.data.type}`)
    );

    if (
      moduleOption.OutgoingConnectionLimit >= 0 &&
      edges.length >= moduleOption.OutgoingConnectionLimit
    ) {
      this.openSnackBar(`No more outgoing connections allowed for ${node.data.type}`);

      return false;
    }

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
        Text: item.data.Text,
        Display: item.data.Display,
        Deleted: item.data.Deleted,
        Settings: item.data.Settings,
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

  protected loadIOName() {
    return 'data-flow-output';
  }

  protected openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  protected parseOutput(
    output: DataFlowOutput,
    toolkit: jsPlumbToolkit,
    params: {}
  ) {
    if (output) {
      toolkit.clear();

      output.Modules.filter(item => {
        return !item.Deleted;
      }).forEach(item => {
        const jspItem = {
          ...item,
          id: item.ID,
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
