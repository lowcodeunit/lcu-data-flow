import { Component, OnInit, Injector, Input } from '@angular/core';
import { DataFlow, LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagementState } from '../../../../core/data-flow-management.state';
import { DataFlowManagementStateContext } from '../../../../core/data-flow-management-state.context';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  public State: DataFlowManagementState;

  //  Constructors
  constructor(protected injector: Injector, protected formBldr: FormBuilder, protected state: DataFlowManagementStateContext) {
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

    this.state.Context.subscribe(state => {
      this.State = state;

      this.handleStateChanged();
    });
  }

  //  API Methods
  public DeleteDataFlow(dataFlow: DataFlow) {
    if (confirm(`Are you sure you want to delete the data flow for '${dataFlow.Name}'?`)) {
      this.State.Loading = true;

      this.state.DeleteDataFlow(dataFlow.Lookup);
    }
  }

  public CreateNewDataFlow() {
    this.State.Loading = true;

    this.state.SaveDataFlow({
      Name: this.CreateNewDataFlowForm.controls.name.value,
      Description: this.CreateNewDataFlowForm.controls.desc.value,
      Lookup: this.CreateNewDataFlowForm.controls.lookup.value
    });
  }

  public SetAcitveDataFlow(dataFlow: DataFlow) {
    this.State.Loading = true;

    this.state.SetActiveDataFlow(dataFlow.Lookup);
  }

  public ToggleIsCreating() {
    this.State.Loading = true;

    this.state.ToggleIsCreating();
  }

  //  Helpers
  protected handleStateChanged() {}
}
