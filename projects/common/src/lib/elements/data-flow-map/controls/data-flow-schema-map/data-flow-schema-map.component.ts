import {
  Component,
  OnInit,
  Injector,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { MatSelectChange, MatSelect } from '@angular/material';
import {
  LCUElementContext,
  LcuElementComponent,
  JSONSchema
} from '@lcu/common';
import {
  DrawingTools,
  Surface,
  jsPlumbToolkit,
  SurfaceRenderParams,
  jsPlumbToolkitOptions,
  SurfaceMode
} from 'jsplumbtoolkit';
import { Subscription } from 'rxjs';
import {
  jsPlumbSurfaceComponent,
  AngularViewOptions,
  jsPlumbService
} from 'jsplumbtoolkit-angular';
import { DataFlowMapJSPlumbToolkitIOService } from './../../../../services/data-flow-map-jsplumb-toolkit-io.service';
import { MatDialog } from '@angular/material/dialog';
import { SchemaFunctionDefinition } from '../../../../models/DataFlowModuleSchemaConfig';
import { DataFlowTableComponent } from '../data-flow-table/data-flow-table';

export class LcuDataFlowSchemaMapElementState {
  public AvailableSchemaFunctions: SchemaFunctionDefinition[];

  public MapID: string;

  public Schemas: JSONSchema[];
}

export class LcuDataFlowSchemaMapContext extends LCUElementContext<
  LcuDataFlowSchemaMapElementState
> {}

export const SELECTOR_LCU_DATA_FLOW_SCHEMA_MAP_ELEMENT =
  'lcu-data-flow-schema-map-element';

@Component({
  selector: SELECTOR_LCU_DATA_FLOW_SCHEMA_MAP_ELEMENT,
  templateUrl: './data-flow-schema-map.component.html',
  styleUrls: ['./data-flow-schema-map.component.scss']
})
export class LcuDataFlowSchemaMapElementComponent
  extends LcuElementComponent<LcuDataFlowSchemaMapContext>
  implements AfterViewInit, OnDestroy, OnInit {
  //  Fields
  // protected dialogRef: MatDialogRef<DialogBodyComponent>;

  protected drawing: DrawingTools;

  protected subscriptions: { [key: string]: Subscription };

  protected surface: Surface;

  protected toolkit: jsPlumbToolkit;

  //  Properties
  public RenderParams: SurfaceRenderParams;

  @ViewChild('schemaOptions', { static: true })
  public SchemaOptions: MatSelect;

  // public SelectMode: SurfaceMode;

  @ViewChild(jsPlumbSurfaceComponent, { static: false })
  public SurfaceComponent: jsPlumbSurfaceComponent;

  public ToolkitParams: jsPlumbToolkitOptions;

  public View: AngularViewOptions;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected $jsplumb: jsPlumbService,
    protected io: DataFlowMapJSPlumbToolkitIOService,
    protected matDialog: MatDialog
  ) {
    super(injector);

    // this.SelectMode = 'pan';

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

      // this.io.SetViewNodes(this.State.ModuleOptions, this.View);

      // await this.Relayout(true);
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
  }

  //  API Methods
  public AddNode(schemaType: string) {
    this.toolkit.addFactoryNode(
      'schema',
      {
        id: '',
        SchemaType: schemaType,
        // IncommingModules: this.IncommingModules,
        // OutgoingModules: this.OutgoingModules
      },
      (node: any) => {
        // this.registerFlowModuleCanvasEvents(node, false);
      }
    );
  }

  public NodeFactory(type: string, data: any, callback: Function) {
    // const dialogRef = ctx.dialog.open(SchemaInputDialogComponent, {
    //   data: {
    //     ctx,
    //     Schemas: ctx.Schemas,
    //     Schema: new JSONSchema(),
    //     SchemaType: data.SchemaType,
    //     CurrentModuleConnection: ctx.CurrentModuleConnection,
    //     HangingIncommingSchemas: ctx.ToolkitComponent.toolkit
    //       .getNodes()
    //       .filter((node) => {
    //         return node.data.SchemaType === 'incomming';
    //       })
    //       .filter((node) => {
    //         return (
    //           ctx.IncommingModules.filter((mod) => {
    //             return mod.id === node.data.IncommingModuleID;
    //           }).length === 0 && ctx.CurrentModuleConnection
    //         );
    //       })
    //       .map((node) => {
    //         return { Node: node };
    //       }),
    //     HangingOutgoingSchemas: ctx.ToolkitComponent.toolkit
    //       .getNodes()
    //       .filter((node) => {
    //         return node.data.SchemaType === 'outgoing';
    //       })
    //       .filter((node) => {
    //         return (
    //           ctx.OutgoingModules.filter((mod) => {
    //             return node.data.OutgoingModuleIDs.indexOf(mod.id) > -1;
    //           }).length === 0 && ctx.CurrentModuleConnection
    //         );
    //       })
    //       .map((node) => {
    //         return { Node: node };
    //       }),
    //     OutgoingSchemas: ctx.ToolkitComponent.toolkit
    //       .getNodes()
    //       .filter((item) => {
    //         return item.data.SchemaType === 'outgoing';
    //       }),
    //     IncommingModules: ctx.IncommingModules,
    //     OutgoingModules: ctx.OutgoingModules,
    //     SchemaChanged: ctx.SchemaChanged,
    //     ContainsFunctions: false,
    //     PropertyTypeChanged: ctx.PropertyTypeChanged,
    //     PropertyAdded: ctx.PropertyAdded,
    //     PropertyDeleted: ctx.PropertyDeleted,
    //     title: 'New Schema - ' + ctx.ModuleName,
    //     FlowID: ctx.FlowID
    //   },
    //   width: '100%',
    //   height: '100%'
    // });
    // dialogRef
    //   .afterClosed()
    //   .subscribe(result =>
    //     ctx.schemaEditorClosed(ctx, result, data, callback, null)
    //   );
  }

  public NodeResolver(typeId: string) {
    return DataFlowTableComponent;
  }

  public SchemaSelected(ev: MatSelectChange) {
    this.AddNode(ev.value);

    this.SchemaOptions.writeValue('');
  }

  //  Helpers
  protected setupJsPlumbSurface() {
    this.RenderParams = this.io.LoadRenderParams();

    this.ToolkitParams = this.io.LoadToolkitParams();

    this.View = this.io.LoadView();

    // if (!this.subscriptions.EdgeAdded) {
    //   this.subscriptions.EdgeAdded = this.io.EdgeAdded.subscribe(params => {
    //     this.edgeAdded(params);
    //   });
    // }

    // if (!this.subscriptions.EdgeDoubleClicked) {
    //   this.subscriptions.EdgeDoubleClicked = this.io.EdgeDoubleClicked.subscribe(
    //     params => {
    //       this.removeEdge(params.edge);
    //     }
    //   );
    // }

    // if (!this.subscriptions.EdgeLabelClicked) {
    //   this.subscriptions.EdgeLabelClicked = this.io.EdgeLabelClicked.subscribe(
    //     params => {
    //       this.editLabel(params.edge);
    //     }
    //   );
    // }

    // if (!this.subscriptions.NodeAdded) {
    //   this.subscriptions.NodeAdded = this.io.NodeAdded.subscribe(params => {
    //     this.nodeAdded(params.node);
    //   });
    // }

    // if (!this.subscriptions.NodeFactoried) {
    //   this.subscriptions.NodeFactoried = this.io.NodeFactoried.subscribe(
    //     params => {
    //       this.nodeFactory(params);
    //     }
    //   );
    // }

    // if (!this.subscriptions.NodeTapped) {
    //   this.subscriptions.NodeTapped = this.io.NodeTapped.subscribe(params => {
    //     // this.toolkit.toggleSelection(params.node);
    //   });
    // }
  }
}
