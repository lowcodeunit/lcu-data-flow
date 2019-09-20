import { Component, OnInit, Injector, Input } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu-ide/common';
import { DataFlowModuleOption } from '../../../../models/DataFlowModuleOption';

export enum DataFlowModulesBankViewTypes {
  Grid,
  List
}

export class LcuDataFlowDataFlowModulesBankElementState {}

export class LcuDataFlowDataFlowModulesBankContext extends LCUElementContext<LcuDataFlowDataFlowModulesBankElementState> {}

export const SelectorLcuDataFlowDataFlowModulesBankElement = 'lcu-data-flow-modules-bank-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowModulesBankElement,
  templateUrl: './data-flow-modules-bank.component.html',
  styleUrls: ['./data-flow-modules-bank.component.scss']
})
export class LcuDataFlowDataFlowModulesBankElementComponent extends LcuElementComponent<LcuDataFlowDataFlowModulesBankContext>
  implements OnInit {
  //  Fields

  //  Properties
  public get Categories(): string[] {
    return this.Options.map(opt => opt.Category).filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  @Input('data-flow-lookup')
  public DataFlowLookup: string;

  @Input('options')
  public Options: DataFlowModuleOption[];

  @Input('view')
  public View: DataFlowModulesBankViewTypes;

  public ViewTypes = DataFlowModulesBankViewTypes;

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);

    this.View = DataFlowModulesBankViewTypes.List;
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();
  }

  //  API Methods
  public DataGenerator(el: Element) {
    return {
      type: el.getAttribute('data-node-type'),
      w: parseInt(el.getAttribute('jtk-width'), 10),
      h: parseInt(el.getAttribute('jtk-height'), 10)
    };
  }

  public GetOptions(category: string) {
    return this.Options.filter(opt => opt.Category === category);
  }

  //  Helpers
}
