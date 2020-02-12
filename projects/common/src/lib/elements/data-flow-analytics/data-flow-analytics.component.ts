import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';

export class LcuDataFlowAnalyticsElementState {}

export class LcuDataFlowAnalyticsContext extends LCUElementContext<LcuDataFlowAnalyticsElementState> {}

export const SelectorLcuDataFlowAnalyticsElement = 'lcu--data-flow-analytics-element';

@Component({
  selector: SelectorLcuDataFlowAnalyticsElement,
  templateUrl: './data-flow-analytics.component.html',
  styleUrls: ['./data-flow-analytics.component.scss']
})
export class LcuDataFlowAnalyticsElementComponent extends LcuElementComponent<LcuDataFlowAnalyticsContext> implements OnInit {
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
