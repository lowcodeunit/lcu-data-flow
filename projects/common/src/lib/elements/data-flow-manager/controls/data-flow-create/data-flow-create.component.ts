import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { DataFlowManagementState } from '../../../../core/data-flow-management.state';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataFlowManagerEventService } from '../../data-flow-manager-event.service';

export class LcuDataFlowDataFlowCreateElementState {}

export class LcuDataFlowDataFlowCreateContext extends LCUElementContext<LcuDataFlowDataFlowCreateElementState> {}

export const SelectorLcuDataFlowDataFlowCreateElement = 'lcu-data-flow-create-element';

@Component({
  selector: SelectorLcuDataFlowDataFlowCreateElement,
  templateUrl: './data-flow-create.component.html',
  styleUrls: ['./data-flow-create.component.scss']
})
export class LcuDataFlowDataFlowCreateElementComponent extends LcuElementComponent<LcuDataFlowDataFlowCreateContext> implements OnInit {
  //  Fields

  //  Properties
  public CreateNewDataFlowForm: FormGroup;

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
      lookup: ['', Validators.required]
    });

    this.handleStateChanged();
  }

  //  API Methods
  public CreateNewDataFlow() {
    this.dataFlowEventService.EmitSaveDataFlowEvent({
      Name: this.CreateNewDataFlowForm.controls.name.value,
      Description: this.CreateNewDataFlowForm.controls.desc.value,
      Lookup: this.CreateNewDataFlowForm.controls.lookup.value
    });
  }

  public ToggleIsCreating() {
    this.dataFlowEventService.EmitToggleIsCreatingEvent();
  }

  //  Helpers
  protected handleStateChanged() {}
}
