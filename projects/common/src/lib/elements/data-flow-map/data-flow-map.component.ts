import {
  Component,
  OnInit,
  Injector,
  Input,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  LCUElementContext,
  LcuElementComponent,
  JSONSchema,
  DataFlowModule
} from '@lcu/common';
import {
  LcuDataFlowSchemaMapElementComponent,
  LcuDataFlowSchemaMapContext
} from './controls/data-flow-schema-map/data-flow-schema-map.component';
import { MatSelectChange } from '@angular/material';

export class DataFlowInOutSchemaMap {
  public Input: { [id: string]: string };

  public Output: { [id: string]: string };
}

export class LcuDataFlowMapElementState {
  // public AvailableSchemaFunctions?: SchemaFunctionDefinition[];

  public DataMapID?: string;

  public InputModules?: DataFlowModule[];

  public OutputModules?: DataFlowModule[];

  public SchemaMap?: DataFlowInOutSchemaMap;

  public Schemas?: JSONSchema[];
}

export class LcuDataFlowMapContext extends LCUElementContext<
  LcuDataFlowMapElementState
> {}

export const SelectorLcuDataFlowMapElement = 'lcu-data-flow-map-element';

@Component({
  selector: SelectorLcuDataFlowMapElement,
  templateUrl: './data-flow-map.component.html',
  styleUrls: ['./data-flow-map.component.scss']
})
export class LcuDataFlowMapElementComponent
  extends LcuElementComponent<LcuDataFlowMapContext>
  implements OnInit, AfterViewInit, OnChanges {
  //  Fields
  protected cdref: ChangeDetectorRef;

  //  Properties
  @ViewChild(LcuDataFlowSchemaMapElementComponent, { static: false })
  public SchemaMap: LcuDataFlowSchemaMapElementComponent;

  @Output('schema-mapped')
  public SchemaMapped: EventEmitter<DataFlowInOutSchemaMap>;

  public SchemaMapContext: LcuDataFlowSchemaMapContext;

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);

    this.cdref = injector.get(ChangeDetectorRef);

    this.SchemaMapped = new EventEmitter();

    this.SchemaMapContext = { State: {} };
  }

  //  Life Cycle
  public ngAfterViewInit() {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.context.currentValue !== changes.context.previousValue) {
      this.mapSchemaContext();
    }
  }

  public ngOnInit() {
    super.ngOnInit();
  }

  //  API Methods
  public SchemaSelected(event: MatSelectChange, direction: string) {
    const schemaId = event.value;
    const moduleId = event.source.id;

    const schemaMap = this.context.State.SchemaMap
      ? { ...this.context.State.SchemaMap }
      : { Input: {}, Output: {} };

    if (!schemaMap.Input) {
      schemaMap.Input = {};
    }

    if (!schemaMap.Output) {
      schemaMap.Output = {};
    }

    schemaMap[direction][moduleId] = schemaId;

    // this.mapSchemaContext();

    this.SchemaMapped.emit(schemaMap);
  }

  //  Helpers
  protected loadSchemasFromMap(schemaMap: { [id: string]: string }) {
    const mapIds = schemaMap ? Object.keys(schemaMap) : [];

    return mapIds.map(mapId => {
      return this.context.State.Schemas.find(
        schema => schema.$id === schemaMap[mapId]
      );
    });
  }

  protected mapSchemaContext() {
    if (this.SchemaMap) {
      const inputSchemas =
        this.context.State.SchemaMap && this.context.State.SchemaMap.Input
          ? this.loadSchemasFromMap(this.context.State.SchemaMap.Input)
          : [];

      const outputSchemas =
        this.context.State.SchemaMap && this.context.State.SchemaMap.Output
          ? this.loadSchemasFromMap(this.context.State.SchemaMap.Output)
          : [];

      this.SchemaMapContext = {
        State: {
          DataMap: {
            InputSchemas: inputSchemas,
            OutputSchemas: outputSchemas,
            // AvailableSchemaFunctions: this.context.State.AvailableSchemaFunctions,
            ID: this.context.State.DataMapID
          }
        }
      };

      // this.cdref.detectChanges();
    }
  }
}
