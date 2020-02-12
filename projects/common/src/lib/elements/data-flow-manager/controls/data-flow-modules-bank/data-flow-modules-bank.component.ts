import { Component, OnInit, Injector, Input } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowModuleOption, DataFlowModuleDisplay } from '@lcu/common';

export enum DataFlowModulesBankViewTypes {
  Grid,
  List
}

export class LcuDataFlowModulesBankElementState {}

export class LcuDataFlowModulesBankContext extends LCUElementContext<LcuDataFlowModulesBankElementState> {}

export const SelectorLcuDataFlowModulesBankElement = 'lcu-data-flow-modules-bank-element';

@Component({
  selector: SelectorLcuDataFlowModulesBankElement,
  templateUrl: './data-flow-modules-bank.component.html',
  styleUrls: ['./data-flow-modules-bank.component.scss']
})
export class LcuDataFlowModulesBankElementComponent extends LcuElementComponent<LcuDataFlowModulesBankContext>
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
    const moduleType = el.getAttribute('module-type');

    const display: DataFlowModuleDisplay = JSON.parse(el.getAttribute('module-display'));

    const settings: any = JSON.parse(el.getAttribute('module-settings'));

    return {
      name: moduleType,
      type: moduleType,
      w: display.Width,
      h: display.Height,
      Display: display,
      Settings: settings
    };
  }

  public GetDisplay(moduleType: string) {
    return this.Displays.find(d => d.ModuleType === moduleType);
  }

  public GetObjString(obj: any) {
    return JSON.stringify(obj);
  }

  public GetOptions(category: string) {
    return this.Options.filter(opt => {
      const display = this.GetDisplay(opt.ModuleType);

      return display.Category === category;
    });
  }

  //  Helpers
}
