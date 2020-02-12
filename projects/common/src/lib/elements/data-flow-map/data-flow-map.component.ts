import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent, JSONSchema } from '@lcu/common';
import { SchemaFunctionDefinition } from '../../models/DataFlowModuleSchemaConfig';

export class LcuDataFlowDataFlowMapElementState {
  public AvailableSchemaFunctions: SchemaFunctionDefinition[];

  public Schemas: JSONSchema[];

}

export class LcuDataFlowDataFlowMapContext extends LCUElementContext<LcuDataFlowDataFlowMapElementState> {}

export const SelectorLcuDataFlowDataFlowMapElement = 'lcu-data-flow-data-flow-map-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowMapElement,
  templateUrl: './data-flow-map.component.html',
  styleUrls: ['./data-flow-map.component.scss']
})
export class LcuDataFlowDataFlowMapElementComponent extends LcuElementComponent<LcuDataFlowDataFlowMapContext> implements OnInit {
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
