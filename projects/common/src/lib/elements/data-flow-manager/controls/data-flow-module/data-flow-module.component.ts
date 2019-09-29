import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';
import { Dialogs, jsPlumbToolkit, Surface } from 'jsplumbtoolkit';
import { DataFlowModuleShapeTypes, DataFlowActionEvent, DataFlow, DataFlowModule } from '@lcu/common';

function isNode(obj: any): obj is Node {
  return obj.objectType === 'Node';
}

/**
 * This is the base class for editable nodes in this demo. It extends `BaseNodeComponent`
 */
export class BaseDataFlowModuleComponent extends BaseNodeComponent {
  public removeNode() {
    const obj = this.getNode();

    if (obj != null) {
      if (isNode(obj)) {
        Dialogs.show({
          id: 'dlgConfirm',
          data: {
            msg: "Delete '" + obj.data.text + "'"
          },
          onOK: () => {
            this.toolkit.removeNode(obj); // <Node> obj);
          }
        });
      }
    }
  }

  public editNode() {
    const obj = this.getNode();
    Dialogs.show({
      id: 'dlgText',
      data: obj.data,
      title: 'Edit ' + obj.data.type + ' name',
      onOK: (data: any) => {
        if (data.text && data.text.length > 2) {
          // if name is at least 2 chars long, update the underlying data and
          // update the UI.
          this.toolkit.updateNode(obj, data);
        }
      }
    });
  }
}

// ----------------- question node -------------------------------

@Component({ templateUrl: 'question.html' })
export class QuestionNodeComponent extends BaseDataFlowModuleComponent {}

// ----------------- action node -------------------------------

@Component({ templateUrl: 'action.html' })
export class ActionNodeComponent extends BaseDataFlowModuleComponent {}

// ----------------- start node -------------------------------

@Component({ templateUrl: 'start.html' })
export class StartNodeComponent extends BaseDataFlowModuleComponent {}

// ----------------- output node -------------------------------

@Component({ templateUrl: 'output.html' })
export class OutputNodeComponent extends BaseDataFlowModuleComponent {}

// -------------- /node components ------------------------------------

@Component({
  templateUrl: './data-flow-module.html'
})
export class DataFlowModuleComponent extends BaseDataFlowModuleComponent implements OnInit {
  // 	Fields

  // 	Properties
  public get Module(): DataFlowModule {
    //  this.obj is managed by BasePortComponent
    return this.obj;
  }

  public ModuleShapes = DataFlowModuleShapeTypes;

  @Output('manage')
  public ManageEvent: EventEmitter<DataFlowModule>;

  // 	Constructors
  constructor() {
    super();

    this.ManageEvent = new EventEmitter();
  }

  // 	Runtime
  public ngOnInit() {
  }

  // 	API Methods
  public Abs(input: number) {
    return Math.abs(input);
  }

  public ManageModule(node: any) {
    this.ManageEvent.emit({
      ...this.Module
    });
  }

  // 	Helpers
}
