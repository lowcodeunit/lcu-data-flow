import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagerState } from '../../../../core/data-flow-manager-state.model';
import { DataFlowManagerStateManagerContext } from '../../../../core/data-flow-manager-state-manager.context';
import { jsPlumbSurfaceComponent, AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import {
  Surface,
  jsPlumbToolkit,
  Dialogs,
  DrawingTools,
  jsPlumbUtil,
  LayoutSpec,
  SurfaceMode,
  SurfaceRenderParams,
  jsPlumbToolkitOptions
} from 'jsplumbtoolkit';
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
  public RenderParams: SurfaceRenderParams;

  public SelectMode: SurfaceMode;

  @ViewChild(jsPlumbSurfaceComponent, { static: false })
  public SurfaceComponent: jsPlumbSurfaceComponent;

  public State: DataFlowManagerState;

  public ToolkitParams: jsPlumbToolkitOptions;

  public View: AngularViewOptions = {
    nodes: {
      // start: {
      //   component: StartNodeComponent
      // },
      'data-flow': {
        component: DataFlowModuleComponent
      },
      selectable: {
        events: {
          tap: (params: any) => {
            // this.ToggleSelection(params.node);
          }
        }
      },
      'data-stream': {
        parent: 'selectable',
        component: DataFlowModuleComponent
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
  public async ngAfterViewInit() {
    this.surface = this.SurfaceComponent.surface;

    this.toolkit = this.surface.getToolkit();

    this.drawing = new DrawingTools({
      renderer: this.surface
    });

    this.io.SetViewNodes(this.State.ModuleOptions, this.View);

    await this.Relayout();
  }

  public ngOnDestroy() {
    console.log('flowchart being destroyed');
  }

  public ngOnInit() {
    super.ngOnInit();

    this.setupJsPlumbSurface();

    this.state.Context.subscribe(async state => {
      this.State = state;

      await this.handleStateChanged();
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

  public async Relayout() {
    if (this.surface && this.State.ActiveDataFlow) {
      await this.io.LoadOntoSurface(this.surface, this.State.ActiveDataFlow.Output);
    }
  }

  public async Save() {
    this.State.Loading = true;

    this.State.ActiveDataFlow.Output = await this.io.ExportFromSurface(this.surface);

    this.state.SaveDataFlow(this.State.ActiveDataFlow);
  }

  public ToggleSelectMode() {
    this.SelectMode = this.SelectMode === 'pan' ? 'select' : 'pan';

    this.surface.setMode(this.SelectMode);
  }

  public ZoomToFit() {
    this.surface.zoomToFit();
  }

  //  Helpers
  protected edgeAdded(params: any) {
    if (params.addedByMouse) {
      this.editLabel(params.edge);
    }
  }

  protected editLabel(edge: any) {
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

  protected async handleStateChanged() {
    this.io.SetViewNodes(this.State.ModuleOptions, this.View);

    await this.Relayout();
  }

  protected removeEdge(edge: any) {
    this.toolkit.removeEdge(edge);
  }

  protected setupJsPlumbSurface() {
    this.RenderParams = this.io.LoadRenderParams();

    this.ToolkitParams = this.io.LoadToolkitParams();

    this.View = this.io.LoadView();

    this.io.EdgeAdded.subscribe(params => {
      this.edgeAdded(params);
    });

    this.io.EdgeDoubleClicked.subscribe(params => {
      this.removeEdge(params.edge);
    });

    this.io.EdgeLabelClicked.subscribe(params => {
      this.editLabel(params.edge);
    });

    this.io.ToggleSelection.subscribe(params => {
      this.toggleSelection(params.node);
    });
  }

  protected toggleSelection(node: any) {
    this.toolkit.toggleSelection(node);
  }
}
