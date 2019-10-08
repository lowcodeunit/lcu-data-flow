import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagerState } from '../../../../core/data-flow-manager-state.model';
import { DataFlowManagerStateManagerContext } from '../../../../core/data-flow-manager-state-manager.context';
import { jsPlumbSurfaceComponent, AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { Surface, jsPlumbToolkit, Dialogs, DrawingTools, jsPlumbUtil, LayoutSpec, SurfaceMode } from 'jsplumbtoolkit';
import { DataFlowModuleComponent } from '../data-flow-module/data-flow-module.component';
import { DataFlowJSPlumbToolkitIOService } from '../../../../services/data-flow-jsplumb-toolkit-io.service';

export class LcuDataFlowDataFlowIdeElementState {}

export class LcuDataFlowDataFlowIdeContext extends LCUElementContext<LcuDataFlowDataFlowIdeElementState> {}

export const SelectorLcuDataFlowDataFlowIdeElement = 'lcu-data-flow-ide-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowIdeElement,
  templateUrl: './data-flow-ide.component.html',
  styleUrls: ['./data-flow-ide.component.scss']
})
export class LcuDataFlowDataFlowIdeElementComponent extends LcuElementComponent<LcuDataFlowDataFlowIdeContext>
  implements AfterViewInit, OnDestroy, OnInit {
  //  Fields
  protected drawing: DrawingTools;

  protected surface: Surface;

  protected toolkit: jsPlumbToolkit;

  //  Properties
  public RenderParams = {
    layout: {
      type: 'Spring'
    },
    events: {
      edgeAdded: (params: any) => {
        if (params.addedByMouse) {
          this.EditLabel(params.edge);
        }
      }
    },
    consumeRightClick: false,
    dragOptions: {
      filter: '.jtk-draw-handle, .node-action, .node-action i'
    }
  };

  public SelectMode: SurfaceMode;

  @ViewChild(jsPlumbSurfaceComponent, { static: false })
  public SurfaceComponent: jsPlumbSurfaceComponent;

  public State: DataFlowManagerState;

  public ToolkitParams = {
    nodeFactory: (type: string, data: any, callback: (data: object) => void) => {
      Dialogs.show({
        id: 'dlgText',
        title: 'Enter ' + type + ' name:',
        onOK: (d: any) => {
          data.text = d.text;
          // if the user entered a name...
          if (data.text) {
            // and it was at least 2 chars
            if (data.text.length >= 2) {
              // set an id and continue.
              data.id = jsPlumbUtil.uuid();

              callback(data);
            } else {
              alert(type + ' names must be at least 2 characters!');
            }
          }
          // else...do not proceed.
        }
      });
    },
    beforeStartConnect: (node: any, edgeType: string) => {
      return { label: '...' };
    }
  };

  public View: AngularViewOptions = {
    nodes: {},
    edges: {
      default: {
        anchor: 'AutoDefault',
        endpoint: 'Blank',
        connector: ['Flowchart', { cornerRadius: 5 }],
        paintStyle: { strokeWidth: 2, stroke: 'rgb(132, 172, 179)', outlineWidth: 3, outlineStroke: 'transparent' },
        hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(67,67,67)' }, // hover paint style for this edge type.
        events: {
          dblclick: (params: any) => {
            Dialogs.show({
              id: 'dlgConfirm',
              data: {
                msg: 'Delete Edge'
              },
              onOK: () => {
                this.RemoveEdge(params.edge);
              }
            });
          }
        },
        overlays: [['Arrow', { location: 1, width: 10, length: 10 }], ['Arrow', { location: 0.3, width: 10, length: 10 }]]
      },
      connection: {
        parent: 'default',
        overlays: [
          [
            'Label',
            {
              label: '${label}',
              events: {
                click: (params: any) => {
                  this.EditLabel(params.edge);
                }
              }
            }
          ]
        ]
      }
    },
    ports: {
      start: {
        endpoint: 'Blank',
        anchor: 'Continuous',
        uniqueEndpoint: true,
        edgeType: 'default'
      },
      source: {
        endpoint: 'Blank',
        paintStyle: { fill: '#84acb3' },
        anchor: 'AutoDefault',
        maxConnections: -1,
        edgeType: 'connection'
      },
      target: {
        maxConnections: -1,
        endpoint: 'Blank',
        anchor: 'AutoDefault',
        paintStyle: { fill: '#84acb3' },
        isTarget: true
      }
    }
  };

  //  Constructors
  constructor(
    protected injector: Injector,
    protected state: DataFlowManagerStateManagerContext,
    protected $jsplumb: jsPlumbService,
    protected io: DataFlowJSPlumbToolkitIOService
  ) {
    super(injector);

    this.SelectMode = 'pan';
  }

  //  Life Cycle
  public ngAfterViewInit() {
    this.surface = this.SurfaceComponent.surface;

    this.toolkit = this.surface.getToolkit();

    this.drawing = new DrawingTools({
      renderer: this.surface
    });

    this.io.LoadOntoSurface(this.surface, this.State.ActiveDataFlow.Output);
  }

  public ngOnDestroy() {
    console.log('flowchart being destroyed');
  }

  public ngOnInit() {
    super.ngOnInit();

    this.state.Context.subscribe(state => {
      this.State = state;

      this.handleStateChanged();
    });
  }

  //  API Methods
  public CancelActive() {
    this.State.Loading = true;

    this.state.SetActiveDataFlow(null);
  }

  public Deploy() {
    this.State.Loading = true;

    this.state.DeployDataFlow(this.State.ActiveDataFlow.Lookup);
  }

  public EditLabel(edge: any) {
    Dialogs.show({
      id: 'dlgText',
      data: {
        text: edge.data.label || ''
      },
      onOK: (data: any) => {
        this.toolkit.updateEdge(edge, { label: data.text });
      }
    });
  }

  public RemoveEdge(edge: any) {
    this.toolkit.removeEdge(edge);
  }

  public Relayout() {
    this.io.LoadOntoSurface(this.surface, this.State.ActiveDataFlow.Output);
  }

  public Save() {
    this.State.Loading = true;

    this.State.ActiveDataFlow.Output = this.io.ExportFromSurface(this.surface);

    this.state.SaveDataFlow(this.State.ActiveDataFlow);
  }

  public ToggleSelection(node: any) {
    this.toolkit.toggleSelection(node);
  }

  public ToggleSelectMode() {
    this.SelectMode = this.SelectMode === 'pan' ? 'select' : 'pan';

    this.surface.setMode(this.SelectMode);
  }

  public ZoomToFit() {
    this.surface.zoomToFit();
  }

  //  Helpers
  protected handleStateChanged() {
    // this.toolkit = this.$jsplumb.getToolkit(this.State.ActiveDataFlow.Lookup, this.ToolkitParams);

    this.View.nodes = {
      selectable: {
        events: {
          tap: (params: any) => {
            this.ToggleSelection(params.node);
          }
        }
      }
    };

    if (this.State.ModuleOptions) {
      this.State.ModuleOptions.forEach(option => {
        this.View.nodes[option.ModuleType] = {
          parent: 'selectable',
          component: DataFlowModuleComponent
        };
      });
    }

    if (this.surface && this.State.ActiveDataFlow) {
      this.io.LoadOntoSurface(this.surface, this.State.ActiveDataFlow.Output);
    }
  }
}
