import { Injectable, EventEmitter } from '@angular/core';
import {
  jsPlumbToolkitIO,
  Surface,
  LayoutSpec,
  jsPlumbToolkit,
  jsPlumbUtil,
  jsPlumbToolkitOptions,
  SurfaceRenderParams,
} from 'jsplumbtoolkit';
import { isString } from 'util';
import {
  AngularViewOptions,
  jsPlumbService,
  ViewNodeAngularOptions,
} from 'jsplumbtoolkit-angular';
import { DataFlowNodeFactoryParams } from '../models/DataFlowNodeFactoryParams';

@Injectable({
  providedIn: 'root',
})
export abstract class LCUJSPlumbToolkitIOService<TOutput> {
  // 	Fields
  protected ioName: string;

  //  Properties
  public CanvasClicked: EventEmitter<Event>;

  public EdgeAdded: EventEmitter<any>;

  public EdgeDoubleClicked: EventEmitter<any>;

  public EdgeLabelClicked: EventEmitter<any>;

  public ModeChanged: EventEmitter<string>;

  public NodeAdded: EventEmitter<any>;

  public NodeFactoried: EventEmitter<DataFlowNodeFactoryParams>;

  public NodeTapped: EventEmitter<any>;

  public PortClicked: EventEmitter<any>;

  public Repainted: EventEmitter<any>;

  public SourceClicked: EventEmitter<any>;

  public TargetClicked: EventEmitter<any>;

  // 	Constructors
  constructor(protected jsPlumb: jsPlumbService) {
    this.ioName = this.loadIOName();

    jsPlumbToolkitIO.parsers[this.ioName] = this.parseOutput;

    jsPlumbToolkitIO.exporters[this.ioName] = this.exportOutput;

    this.CanvasClicked = new EventEmitter();

    this.EdgeAdded = new EventEmitter();

    this.EdgeDoubleClicked = new EventEmitter();

    this.EdgeLabelClicked = new EventEmitter();

    this.ModeChanged = new EventEmitter();

    this.NodeAdded = new EventEmitter();

    this.NodeFactoried = new EventEmitter();

    this.NodeTapped = new EventEmitter();

    this.PortClicked = new EventEmitter();

    this.Repainted = new EventEmitter();

    this.SourceClicked = new EventEmitter();

    this.TargetClicked = new EventEmitter();
  }

  // 	API Methods
  public async ExportFromSurface(surface: Surface): Promise<TOutput> {
    const toolkit = surface.getToolkit();

    return <TOutput>toolkit.exportData({
      type: this.ioName,
      parameters: {},
    });
  }

  public async GetSurface(surfaceId: string) {
    return new Promise<Surface>((resolve) => {
      this.jsPlumb.getSurface(surfaceId, (surface) => {
        resolve(surface);
      });
    });
  }

  public async LoadOntoSurface(
    surface: Surface,
    output: TOutput,
    refreshOutput: boolean,
    layoutSpec: LayoutSpec | string = null
  ) {
    if (!layoutSpec) {
      layoutSpec = this.loadDefaultLayoutSpec();
    } else if (isString(layoutSpec)) {
      layoutSpec = this.loadDefaultLayoutSpec(layoutSpec);
    }

    if (refreshOutput) {
      await this.LoadOutput(surface, output);
    }

    surface.repaintEverything();

    surface.setLayout(<LayoutSpec>layoutSpec);

    surface.zoomToFit();
  }

  public async LoadOutput(surface: Surface, output: TOutput) {
    return new Promise<void>((resolve) => {
      const toolkit = surface.getToolkit();

      toolkit.load({
        type: this.ioName,
        data: <any>output || {},
        parameters: {},
        onload() {
          resolve();
        },
      });
    });
  }

  public LoadRenderParams(): SurfaceRenderParams {
    return {
      layout: {
        type: 'Absolute',
      },
      events: {
        canvasClick: (e: Event) => {
          this.CanvasClicked.emit(e);
        },
        objectRepainted: () => this.Repainted.emit({}),
        edgeAdded: (params: any) => {
          this.EdgeAdded.emit(params);
        },
        modeChanged: (mode: string) => this.ModeChanged.emit(mode),
        nodeAdded: (params: any) => {
          this.NodeAdded.emit(params);
        },
        // edgeTarget: (edge: any, oldTarget: any, newTarget: any) => {
        //   alert('moved');
        // },  // edgeMoved(this.ctx, edge, oldTarget, newTarget),
      },
      lassoInvert: false,
      elementsDroppable: true,
      consumeRightClick: false,
      dragOptions: {
        filter: '.jtk-draw-handle, .node-action, .node-action i, .bank-module',
        // magnetize: false
      },
      modelLeftAttribute: 'Left',
      modelTopAttribute: 'Top',
    };
  }

  public LoadToolkitParams(): jsPlumbToolkitOptions {
    return {
      nodeFactory: (
        type: string,
        data: any,
        callback: (data: object) => void
      ) => {
        this.NodeFactoried.emit({ Type: type, Data: data, Callback: callback });
      },
    };
  }

  /**
   * Setup view options
   */
  public LoadView(): AngularViewOptions {
    const view: AngularViewOptions = {
      nodes: {
        parent: this.loadParentNode(),
      },
      edges: {
        default: {
          anchor: 'AutoDefault',
          endpoint: 'Blank',
          connector: ['Flowchart', { cornerRadius: 5 }],
          paintStyle: {
            strokeWidth: 2,
            stroke: 'rgb(132, 172, 179)',
            outlineWidth: 3,
            outlineStroke: 'transparent',
          },
          hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(67,67,67)' },
          overlays: [
            ['Arrow', { location: 1, width: 10, length: 10 }],
            ['Arrow', { location: 0.3, width: 10, length: 10 }],
          ],
          events: {
            dblclick: (params: any) => {
              this.EdgeDoubleClicked.emit(params);
            },
          },
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
                    this.EdgeLabelClicked.emit(params);
                  },
                },
              },
            ],
          ],
        },
      },
      ports: {
        default: {
          paintStyle: { fill: '#f76258' }, // the endpoint's appearance
          // hoverPaintStyle: { fill: '#434343' }, // appearance when mouse hovering on endpoint or connection,
          events: {
            click: (params: any) => {
              this.PortClicked.emit(params);
            },
          },
        },
        source: {
          endpoint: 'Blank',
          edgeType: 'default',
          paintStyle: { fill: '#f76258' }, // the endpoint's appearance
          // hoverPaintStyle: { fill: '#434343' },
          anchor: 'Right',
          maxConnections: -1,
          events: {
            click: (params: any) => {
              this.SourceClicked.emit(params);
            },
          },
          isSource: true,
          isTarget: false,
        },
        target: {
          maxConnections: -1,
          endpoint: 'Blank',
          edgeType: 'default',
          anchor: 'Left',
          paintStyle: { fill: '#f76258' }, // the endpoint's appearance
          // hoverPaintStyle: { fill: '#434343' },
          isSource: false,
          isTarget: true,
          events: {
            click: (params: any) => {
              this.TargetClicked.emit(params);
            },
          },
        },
      },
    };

    return view;
  }

  // 	Helpers
  protected abstract exportOutput(toolkit: jsPlumbToolkit, params: {}): TOutput;

  protected loadDefaultLayoutSpec(type: string = 'Hierarchical'): LayoutSpec {
    return <LayoutSpec>{
      type,
      parameters: {
        padding: [150, 150],
        orientation: 'vertical',
      },
    };
  }

  protected loadParentNode(): ViewNodeAngularOptions {
    return {
      events: {
        tap: (params: any) => this.NodeTapped.emit(params),
      },
    };
  }

  protected abstract loadIOName(): string;

  protected abstract parseOutput(
    output: TOutput,
    toolkit: jsPlumbToolkit,
    params: {}
  ): void;
}
