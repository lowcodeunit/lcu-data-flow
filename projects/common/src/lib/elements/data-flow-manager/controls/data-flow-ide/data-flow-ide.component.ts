import { DialogBodyComponent } from './../dialog-body/dialog-body.component';
import {
  Component,
  OnInit,
  Injector,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagementState } from '../../../../core/data-flow-management.state';
import {
  jsPlumbSurfaceComponent,
  AngularViewOptions,
  jsPlumbService
} from 'jsplumbtoolkit-angular';
import {
  Surface,
  jsPlumbToolkit,
  DrawingTools,
  jsPlumbUtil,
  SurfaceMode,
  SurfaceRenderParams,
  jsPlumbToolkitOptions,
  Edge
} from 'jsplumbtoolkit';
import { DataFlowJSPlumbToolkitIOService } from '../../../../services/data-flow-jsplumb-toolkit-io.service';
import { DataFlowNodeFactoryParams } from '../../../../models/DataFlowNodeFactoryParams';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataFlowManagerEventService } from '../../data-flow-manager-event.service';

export interface DialogData {
  animal: string;
  name: string;
}

export class LcuDataFlowDataFlowIdeElementState extends DataFlowManagementState {}

export class LcuDataFlowDataFlowIdeContext extends LCUElementContext<LcuDataFlowDataFlowIdeElementState> {}

export const SelectorLcuDataFlowDataFlowIdeElement = 'lcu-data-flow-ide-element';

// @Component({
//   selector: 'dialog-overview-example-dialog',
//   templateUrl: 'dialog-overview-example-dialog.html',
// })
// export class DialogOverviewExampleDialog {

//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }

@Component({
  selector: SelectorLcuDataFlowDataFlowIdeElement,
  templateUrl: './data-flow-ide.component.html',
  styleUrls: ['./data-flow-ide.component.scss']
})
export class LcuDataFlowDataFlowIdeElementComponent extends LcuElementComponent<LcuDataFlowDataFlowIdeContext>
                                                    implements AfterViewInit, OnDestroy, OnInit {
  //  Fields
  protected dialogRef: MatDialogRef<DialogBodyComponent>;

  protected drawing: DrawingTools;

  protected subscriptions: { [key: string]: Subscription };

  protected surface: Surface;

  protected toolkit: jsPlumbToolkit;

  //  Properties
  public IsModuleSidebarOpened: boolean;

  public RenderParams: SurfaceRenderParams;

  public SelectMode: SurfaceMode;

  public ToolkitParams: jsPlumbToolkitOptions;

  public View: AngularViewOptions;

  public get State(): DataFlowManagementState {
    return this.context.State;
  }

  @ViewChild(jsPlumbSurfaceComponent)
  public SurfaceComponent: jsPlumbSurfaceComponent;

  //  Constructors
  constructor(
    protected $jsplumb: jsPlumbService,
    protected dataFlowEventService: DataFlowManagerEventService,
    protected injector: Injector,
    protected io: DataFlowJSPlumbToolkitIOService,
    protected matDialog: MatDialog
  ) {
    super(injector);

    this.IsModuleSidebarOpened = true;

    this.SelectMode = 'pan';

    this.subscriptions = {};
  }

  //  Life Cycle
  public async ngAfterViewInit() {
    this.surface = this.SurfaceComponent ? this.SurfaceComponent.surface : null;

    if (this.surface) {
      this.toolkit = this.surface.getToolkit();

      this.drawing = new DrawingTools({
        renderer: this.surface
      });

      this.io.SetViewNodes(this.State.ModuleOptions, this.View);

      await this.Relayout(true);
    }
  }

  public ngOnDestroy() {
    for (const key in this.subscriptions) {
      if (this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();

        delete this.subscriptions[key];
      }
    }
  }

  public ngOnInit() {
    super.ngOnInit();

    this.setupJsPlumbSurface();
    this.handleStateChanged();
  }

  //  API Methods
  public CancelActive() {
    this.dataFlowEventService.EmitSetActiveDataFlowEvent(null);
  }

  public Deploy() {
    this.dataFlowEventService.EmitDeployDataFlowEvent(this.State.ActiveDataFlow.Lookup);
  }
  public ModuleSidebarToggled(event: any): void {
    this.IsModuleSidebarOpened = event;
  }

  public async Relayout(refreshOutput: boolean = false) {
    if (this.surface && this.State.ActiveDataFlow) {
      await this.io.LoadOntoSurface(
        this.surface,
        this.State.ActiveDataFlow.Output,
        refreshOutput
      );
    }
  }

  public async Save() {
    this.State.ActiveDataFlow.Output = await this.io.ExportFromSurface(
      this.surface
    );
    this.dataFlowEventService.EmitSaveDataFlowEvent(this.State.ActiveDataFlow);
  }

  public ToggleCreationModules() {
    this.dataFlowEventService.EmitToggleCreationModulesEvent();
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
    // if (params.addedByMouse) {
    //   this.editLabel(params.edge);
    // }
  }

  protected editLabel(edge: Edge) {
    //  TODO:  REplace with Material dialogs
    // Dialogs.show({
    //   id: 'dlgText',
    //   data: {
    //     text: edge.data.label || ''
    //   },
    //   onOK: (data: any) => {
    //     this.toolkit.updateEdge(edge, { label: data.text });
    //   }
    // });
  }

  protected async handleStateChanged() {
    if (this.State.ActiveDataFlow) {
      this.toolkit = this.$jsplumb.getToolkit(
        this.State.ActiveDataFlow.Lookup,
        this.ToolkitParams
      );

      this.io.SetViewNodes(this.State.ModuleOptions, this.View);
    }

    await this.Relayout(true);
  }

  protected nodeAdded(node: {
    type: string;
    data: any;
    callback: (data: object) => void;
  }) {}

  protected nodeFactory(params: DataFlowNodeFactoryParams) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = params;
    dialogConfig.disableClose = true;

    if (this.dialogRef != null) {
      this.dialogRef.close({});

      this.dialogRef = null;
    }

    this.dialogRef = this.matDialog.open(DialogBodyComponent, dialogConfig);

    this.dialogRef.afterClosed().subscribe(value => {
      const data = {
        ...params.Data,
        Text: value.data
      };

      if (data.Text) {
        if (data.Text.length >= 2) {
          data.id = jsPlumbUtil.uuid();

          params.Callback(data);
        } else {
          alert(`${data.Display.ModuleType} names must be at least 2 characters!`);
        }
      }
    });
  }

  protected removeEdge(edge: any) {
    this.toolkit.removeEdge(edge);
  }

  protected setupJsPlumbSurface() {
    this.RenderParams = this.io.LoadRenderParams();

    this.ToolkitParams = this.io.LoadToolkitParams();

    this.View = this.io.LoadView();

    if (!this.subscriptions.EdgeAdded) {
      this.subscriptions.EdgeAdded = this.io.EdgeAdded.subscribe(
        (params: any) => {
          this.edgeAdded(params);
        }
      );
    }

    if (!this.subscriptions.EdgeDoubleClicked) {
      this.subscriptions.EdgeDoubleClicked = this.io.EdgeDoubleClicked.subscribe(
        (params: any) => {
          this.removeEdge(params.edge);
        }
      );
    }

    if (!this.subscriptions.EdgeLabelClicked) {
      this.subscriptions.EdgeLabelClicked = this.io.EdgeLabelClicked.subscribe(
        (params: any) => {
          this.editLabel(params.edge);
        }
      );
    }

    if (!this.subscriptions.NodeAdded) {
      this.subscriptions.NodeAdded = this.io.NodeAdded.subscribe(
        (params: any) => {
          this.nodeAdded(params.node);
        }
      );
    }

    if (!this.subscriptions.NodeFactoried) {
      this.subscriptions.NodeFactoried = this.io.NodeFactoried.subscribe(
        (params: any) => {
          this.nodeFactory(params);
        }
      );
    }

    if (!this.subscriptions.NodeTapped) {
      this.subscriptions.NodeTapped = this.io.NodeTapped.subscribe(
        (params: any) => {
          // this.toolkit.toggleSelection(params.node);
        }
      );
    }
  }
}
