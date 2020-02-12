import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent, JSONSchema } from '@lcu/common';
import { SchemaFunctionDefinition } from '../../models/DataFlowModuleSchemaConfig';

export class LcuDataFlowMapElementState {
  public AvailableSchemaFunctions: SchemaFunctionDefinition[];

  public MapID: string;

  public Schemas: JSONSchema[];
}

export class LcuDataFlowMapContext extends LCUElementContext<LcuDataFlowMapElementState> {}

export const SelectorLcuDataFlowMapElement = 'lcu-data-flow-map-element';

@Component({
  selector: SelectorLcuDataFlowMapElement,
  templateUrl: './data-flow-map.component.html',
  styleUrls: ['./data-flow-map.component.scss']
})
export class LcuDataFlowMapElementComponent extends LcuElementComponent<LcuDataFlowMapContext> implements OnInit {
  //  Fields

  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();
  }

  //  API Methods

  //  Helpers
}
