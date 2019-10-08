import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagerState } from '../../../../core/data-flow-manager-state.model';
import { DataFlowManagerStateManagerContext } from '../../../../core/data-flow-manager-state-manager.context';
import { jsPlumbSurfaceComponent, AngularViewOptions, jsPlumbService } from 'jsplumbtoolkit-angular';
import { Surface, jsPlumbToolkit, Dialogs, DrawingTools, jsPlumbUtil, LayoutSpec, SurfaceMode, jsPlumbToolkitOptions, SurfaceRenderParams } from 'jsplumbtoolkit';
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

  public View: AngularViewOptions;

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

    this.RenderParams = this.io.LoadRenderParams(this.toolkit);

    this.ToolkitParams = this.io.LoadToolkitParams(this.toolkit);

    this.View = this.io.LoadView(this.toolkit);

    this.io.SetViewNodes(this.toolkit, this.State.ModuleOptions, this.View);

    this.Relayout();
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

  public Relayout() {
    if (this.surface && this.State.ActiveDataFlow) {
      this.io.LoadOntoSurface(this.surface, this.State.ActiveDataFlow.Output);
    }
  }

  public Save() {
    this.State.Loading = true;

    this.State.ActiveDataFlow.Output = this.io.ExportFromSurface(this.surface);

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
  protected handleStateChanged() {
    this.io.SetViewNodes(this.toolkit, this.State.ModuleOptions, this.View);

    this.Relayout();
  }
}
