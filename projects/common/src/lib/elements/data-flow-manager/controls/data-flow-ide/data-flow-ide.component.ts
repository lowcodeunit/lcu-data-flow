import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu-ide/common';
import { DataFlow } from '../../../../models/DataFlow';
import { DataFlowManagerState } from '../../../../core/data-flow-manager-state.model';
import { DataFlowManagerStateManagerContext } from '../../../../core/data-flow-manager-state-manager.context';
import { jsPlumbSurfaceComponent, AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { Surface, jsPlumbToolkit, Dialogs, DrawingTools, jsPlumbUtil } from 'jsplumbtoolkit';
import {
  StartNodeComponent,
  QuestionNodeComponent,
  OutputNodeComponent,
  ActionNodeComponent
} from '../data-flow-module/data-flow-module.component';

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

  //  Properties
  public NodeTypes = [
    { label: 'Question', type: 'question', w: 120, h: 120 },
    { label: 'Action', type: 'action', w: 120, h: 70 },
    { label: 'Output', type: 'output', w: 120, h: 70 }
  ];

  @ViewChild(jsPlumbSurfaceComponent, { static: false })
  public SurfaceComponent: jsPlumbSurfaceComponent;

  public Surface: Surface;

  @Input('surface-id')
  public SurfaceID: string;

  public Toolkit: jsPlumbToolkit;

  @Input('toolkit-id')
  public ToolkitID: string;

  public State: DataFlowManagerState;

  public View: AngularViewOptions = {
    nodes: {
      start: {
        component: StartNodeComponent
      },
      selectable: {
        events: {
          tap: (params: any) => {
            this.ToggleSelection(params.node);
          }
        }
      },
      question: {
        parent: 'selectable',
        component: QuestionNodeComponent
      },
      output: {
        parent: 'selectable',
        component: OutputNodeComponent
      },
      action: {
        parent: 'selectable',
        component: ActionNodeComponent
      }
    },
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

  //  Constructors
  constructor(protected injector: Injector, protected state: DataFlowManagerStateManagerContext, protected $jsplumb: jsPlumbService) {
    super(injector);
  }

  //  Life Cycle
  public ngAfterViewInit() {
    this.Surface = this.SurfaceComponent.surface;

    this.Toolkit = this.Surface.getToolkit();

    this.drawing = new DrawingTools({
      renderer: this.Surface
    });

    this.Toolkit.load({ url: 'data/flowchart-1.json' });
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

    this.Toolkit = this.$jsplumb.getToolkit(this.ToolkitID, this.ToolkitParams);
  }

  //  API Methods
  public CancelActive() {
    this.State.Loading = true;

    this.state.SetActiveDataFlow(null);
  }

  public GetToolkit(): jsPlumbToolkit {
    return this.Toolkit;
  }

  public ToggleSelection(node: any) {
    this.Toolkit.toggleSelection(node);
  }

  public RemoveEdge(edge: any) {
    this.Toolkit.removeEdge(edge);
  }

  public EditLabel(edge: any) {
    Dialogs.show({
      id: 'dlgText',
      data: {
        text: edge.data.label || ''
      },
      onOK: (data: any) => {
        this.Toolkit.updateEdge(edge, { label: data.text });
      }
    });
  }

  //  Helpers
  protected handleStateChanged() {
    this.State.ModuleOptions = [
      {
        Description: 'Test desc',
        Icon: { Icon: 'cloud' },
        Category: 'Test',
        ModuleType: 'TestModule',
        Name: 'Infrastructure'
      },
      {
        Description: 'Test desc',
        Icon: { Icon: 'cloud' },
        Category: 'Test',
        ModuleType: 'TestModule2',
        Name: 'Infrastructure 2.0'
      },
      {
        Description: 'Test desc',
        Icon: { Icon: 'settings' },
        Category: 'Admin',
        ModuleType: 'TestModule3',
        Name: 'OMS'
      },
      {
        Description: 'Test desc',
        Icon: { Icon: 'dashboard' },
        Category: 'Admin',
        ModuleType: 'TestModule4',
        Name: 'Active Directory'
      }
    ];
  }
}
