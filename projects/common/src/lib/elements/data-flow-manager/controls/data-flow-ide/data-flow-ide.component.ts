import { DialogBodyComponent } from './../dialog-body/dialog-body.component';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, Input, Inject } from '@angular/core';
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
  jsPlumbToolkitOptions,
  Node,
  Edge
} from 'jsplumbtoolkit';
import { DataFlowModuleComponent } from '../data-flow-module/data-flow-module.component';
import { DataFlowJSPlumbToolkitIOService } from '../../../../services/data-flow-jsplumb-toolkit-io.service';
import { DataFlowNodeFactoryParams } from '../../../../models/DataFlowNodeFactoryParams';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}


export class LcuDataFlowDataFlowIdeElementState {}

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
    protected io: DataFlowJSPlumbToolkitIOService,
    protected matDialog: MatDialog
  ) {
    super(injector);

    this.SelectMode = 'pan';
  }

  //  Life Cycle
  public async ngAfterViewInit() {
    this.surface = this.SurfaceComponent.surface;

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
    console.log('flowchart being destroyed');

    //  TODO: Destroy all subscription, like state sub
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

  public async Relayout(refreshOutput: boolean = false) {
    if (this.surface && this.State.ActiveDataFlow) {
      await this.io.LoadOntoSurface(this.surface, this.State.ActiveDataFlow.Output, refreshOutput);
    }
  }

  public async Save() {
    this.State.Loading = true;

    this.State.ActiveDataFlow.Output = await this.io.ExportFromSurface(this.surface);

    this.state.SaveDataFlow(this.State.ActiveDataFlow);
  }

  public ToggleCreationModules() {
    this.State.Loading = true;

    this.state.ToggleCreationModules();
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
    if (this.State.ActiveDataFlow) {
      this.toolkit = this.$jsplumb.getToolkit(this.State.ActiveDataFlow.Lookup, this.ToolkitParams);

      this.io.SetViewNodes(this.State.ModuleOptions, this.View);
    }

    await this.Relayout(true);
  }

  protected nodeAdded(node: { type: string; data: any; callback: (data: object) => void }) {}

  protected nodeFactory(params: DataFlowNodeFactoryParams) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = params;

    const dialogRef = this.matDialog.open(DialogBodyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${value.data}`);
      const data = {
        ...params.Data,
        name: value.data,
        Text: value.data
      };
      data.text = value.data;

      if (data.text) {
        if (data.text.length >= 2) {
          data.id = jsPlumbUtil.uuid();

          params.Callback(data);
        } else {
          alert(`${data.type} names must be at least 2 characters!`);
        }
      }
    });

    // Dialogs.show({
    //   id: 'dlgText',
    //   title: `Enter ${params.Data.type} name:`,
    //   onOK: (d: any) => {
    //     const data = {
    //       ...params.Data,
    //       name: d.text,
    //       Text: d.text
    //     };

    //     data.text = d.text;

    //     if (data.text) {
    //       if (data.text.length >= 2) {
    //         data.id = jsPlumbUtil.uuid();

    //         params.Callback(data);
    //       } else {
    //         alert(`${data.type} names must be at least 2 characters!`);
    //       }
    //     }
    //     // else...do not proceed.
    //   }
    // });
    // if (!node.data.Text) {
    //   Dialogs.show({
    //     id: 'dlgText',
    //     title: `Enter ${node.data.type} name:`,
    //     onOK: (d: any) => {
    //       const data = {
    //         ...node.data,
    //         name: d.text,
    //         Text: d.text
    //       };

    //       if (data.name) {
    //         if (data.name.length >= 2) {
    //           data.id = jsPlumbUtil.uuid();

    //           this.toolkit.updateNode(node, data);
    //         } else {
    //           alert(`${data.type} names must be at least 2 characters!`);

    //           this.nodeAdded(node);
    //         }
    //       } else {
    //         this.toolkit.removeNode(node);
    //       }
    //     }
    //   });
    // }
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

    this.io.NodeAdded.subscribe(params => {
      this.nodeAdded(params.node);
    });

    this.io.NodeFactoried.subscribe(params => {
      this.nodeFactory(params);
    });

    this.io.ToggleSelection.subscribe(params => {
      this.toggleSelection(params.node);
    });
  }

  protected toggleSelection(node: any) {
    this.toolkit.toggleSelection(node);
  }
}
