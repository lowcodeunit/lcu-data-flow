import { Component, OnInit, Injector, Input } from '@angular/core';
import { DataFlow, LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagerState } from '../../../../core/data-flow-manager-state.model';
import { DataFlowManagerStateManagerContext } from '../../../../core/data-flow-manager-state-manager.context';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class LcuDataFlowListElementState {
  public DataFlows: DataFlow[];
}

export class LcuDataFlowListContext extends LCUElementContext<LcuDataFlowListElementState> {}

export const SelectorLcuDataFlowListElement = 'lcu-data-flow-list-element';

@Component({
  selector: SelectorLcuDataFlowListElement,
  templateUrl: './data-flow-list.component.html',
  styleUrls: ['./data-flow-list.component.scss']
})
export class LcuDataFlowListElementComponent extends LcuElementComponent<LcuDataFlowListContext> implements OnInit {
  //  Fields

  //  Properties
  public CreateNewDataFlowForm: FormGroup;

  public State: DataFlowManagerState;

  //  Constructors
  constructor(protected injector: Injector, protected formBldr: FormBuilder, protected state: DataFlowManagerStateManagerContext) {
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
