import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';

export class LcuDataFlowDataFlowAnalyticsElementState {}

export class LcuDataFlowDataFlowAnalyticsContext extends LCUElementContext<LcuDataFlowDataFlowAnalyticsElementState> {}

export const SelectorLcuDataFlowDataFlowAnalyticsElement = 'lcu-data-flow-data-flow-analytics-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowAnalyticsElement,
  templateUrl: './data-flow-analytics.component.html',
  styleUrls: ['./data-flow-analytics.component.scss']
})
export class LcuDataFlowDataFlowAnalyticsElementComponent extends LcuElementComponent<LcuDataFlowDataFlowAnalyticsContext> implements OnInit {
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
