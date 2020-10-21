import { Component, OnInit, Injector } from '@angular/core';
import { DataFlow, LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagementState } from '../../../../core/data-flow-management.state';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
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

  public get DataFlowLookup(): AbstractControl {
    return !this.CreateNewDataFlowForm ? null : this.CreateNewDataFlowForm.get('lookup');
  }

  public get DataFlowLookupHasError(): boolean {
    return (
      this.DataFlowLookup.hasError('pattern') ||
      this.DataFlowLookup.hasError('required')
    );
  }

  public get DataFlowLookupErrorMessage(): string {
    if (this.DataFlowLookup.hasError('pattern')) {
      return `The Project lookup must contain 1 - 4 charaters, all lowercase with '-'. A '-' may not start or end the value.`;
    } else if (this.DataFlowLookup.hasError('required')) {
      return 'The Data Flow lookup is required.';
    }
  }

  public get State(): DataFlowManagementState {
    return this.context.State;
  }

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
      lookup: ['', {
        validators: Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z-]{1,4}$'),
        ]),
        updateOn: 'change',
      }]
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

  public HealthStatus(dataFlow: DataFlow): string {
    return dataFlow.Name !== 'Test' ? '' : 'Health Error';
  }

  //  Helpers
  protected handleStateChanged() {}
}
