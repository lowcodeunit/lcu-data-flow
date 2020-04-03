import { Component, OnInit, Injector, Input } from '@angular/core';
import { DataFlow, LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagementState } from '../../../../core/data-flow-management.state';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataFlowManagerEventService } from '../../data-flow-manager-event.service';

export class LcuDataFlowDataFlowListElementState {
  public DataFlows: DataFlow[];
}

export class LcuDataFlowDataFlowListContext extends LCUElementContext<LcuDataFlowDataFlowListElementState> {}

export const SelectorLcuDataFlowDataFlowListElement = 'lcu-data-flow-list-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowListElement,
  templateUrl: './data-flow-list.component.html',
  styleUrls: ['./data-flow-list.component.scss']
})
export class LcuDataFlowDataFlowListElementComponent extends LcuElementComponent<LcuDataFlowDataFlowListContext> implements OnInit {
  //  Fields

  //  Properties
  public CreateNewDataFlowForm: FormGroup;

  public get State(): DataFlowManagementState {
    return this.context.State;
  }

  @Input('data-flow-lists')
  public DataFlowLists: any = { activeDataFlows: [] };

  //  Constructors
  constructor(
    protected dataFlowEventService: DataFlowManagerEventService,
    protected formBldr: FormBuilder,
    protected injector: Injector
  ) {
    super(injector);
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.CreateNewDataFlowForm = this.formBldr.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      lookup: ['', Validators.required]
    });

    this.handleStateChanged();
  }

  //  API Methods
  public DeleteDataFlow(dataFlow: DataFlow) {
    if (confirm(`Are you sure you want to delete the data flow for '${dataFlow.Name}'?`)) {
      this.dataFlowEventService.EmitDeleteDataFlowEvent(dataFlow.Lookup);
    }
  }

  public CreateNewDataFlow() {
    this.dataFlowEventService.EmitSaveDataFlowEvent({
      Name: this.CreateNewDataFlowForm.controls.name.value,
      Description: this.CreateNewDataFlowForm.controls.desc.value,
      Lookup: this.CreateNewDataFlowForm.controls.lookup.value
    });
  }

  public SetActiveDataFlow(dataFlow: DataFlow) {
    this.dataFlowEventService.EmitSetActiveDataFlowEvent(dataFlow.Lookup);
  }

  public ToggleIsCreating() {
    this.dataFlowEventService.EmitToggleIsCreatingEvent();
  }

  //  Helpers
  protected handleStateChanged() { }
}
