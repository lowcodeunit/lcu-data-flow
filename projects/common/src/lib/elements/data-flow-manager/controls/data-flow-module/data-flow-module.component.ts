import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu-ide/common';
import { DataFlow } from '../../../../models/DataFlow';
import { DataFlowManagerState } from '../../../../core/data-flow-manager-state.model';
import { DataFlowManagerStateManagerContext } from '../../../../core/data-flow-manager-state-manager.context';
import { jsPlumbSurfaceComponent, AngularViewOptions, BaseNodeComponent } from 'jsplumbtoolkit-angular';
import { Surface, jsPlumbToolkit, Dialogs, DrawingTools } from 'jsplumbtoolkit';

function isNode(obj: any): obj is Node {
  return obj.objectType === 'Node';
}

/**
 * This is the base class for editable nodes in this demo. It extends `BaseNodeComponent`
 */
export class DataFlowModuleComponent extends BaseNodeComponent {
  removeNode() {
    const obj = this.getNode();

    if (obj != null) {
      if (isNode(obj)) {
        Dialogs.show({
          id: 'dlgConfirm',
          data: {
            msg: 'Delete \'' + obj.data.text + '\''
          },
          onOK: () => {
            this.toolkit.removeNode(obj); // <Node> obj);
          }
        });
      }
    }
  }

  editNode() {
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
export class QuestionNodeComponent extends DataFlowModuleComponent {}

// ----------------- action node -------------------------------

@Component({ templateUrl: 'action.html' })
export class ActionNodeComponent extends DataFlowModuleComponent {}

// ----------------- start node -------------------------------

@Component({ templateUrl: 'start.html' })
export class StartNodeComponent extends DataFlowModuleComponent {}

// ----------------- output node -------------------------------

@Component({ templateUrl: 'output.html' })
export class OutputNodeComponent extends DataFlowModuleComponent {}

// -------------- /node components ------------------------------------
