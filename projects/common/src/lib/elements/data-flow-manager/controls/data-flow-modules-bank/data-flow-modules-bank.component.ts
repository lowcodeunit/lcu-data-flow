import { Component, OnInit, Injector, Input } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowModuleOption, DataFlowModuleDisplay } from '@lcu/common';

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
    return this.Options.map(opt => {
      const display = this.GetDisplay(opt.ModuleType);

      return display.Category;
    }).filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  @Input('data-flow-lookup')
  public DataFlowLookup: string;

  @Input('displays')
  public Displays: DataFlowModuleDisplay[];

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
      name: el.getAttribute('module-type'),
      type: el.getAttribute('module-type'),
      w: parseInt(el.getAttribute('module-width'), 10),
      h: parseInt(el.getAttribute('module-height'), 10)
    };
  }

  public GetDisplay(moduleType: string) {
    return this.Displays.find(d => d.ModuleType === moduleType);
  }

  public GetOptions(category: string) {
    return this.Options.filter(opt => {
      const display = this.GetDisplay(opt.ModuleType);

      return display.Category === category;
    });
  }

  //  Helpers
}
