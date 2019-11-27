import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';
import { jsPlumbToolkit, Surface } from 'jsplumbtoolkit';
import {
  DataFlowModuleShapeTypes,
  DataFlowActionEvent,
  DataFlow,
  DataFlowModule
} from '@lcu/common';
import {
  MatDialogRef,
  MatDialogConfig,
  MatDialog
} from '@angular/material/dialog';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { DialogModuleConfigureComponent } from '../dialog-module-configure/dialog-module-configure.component';

function isNode(obj: any): obj is Node {
  return obj.objectType === 'Node';
}

/**
 * This is the base class for editable nodes in this demo. It extends `BaseNodeComponent`
 */
export class BaseDataFlowModuleComponent extends BaseNodeComponent {}

// -------------- /node components ------------------------------------

@Component({
  templateUrl: './data-flow-module.html'
})
export class DataFlowModuleComponent extends BaseDataFlowModuleComponent
  implements AfterViewInit, OnInit {
  // 	Fields
  protected editNameDialogRef: MatDialogRef<DialogBodyComponent>;

  protected configureDialogRef: MatDialogRef<DialogModuleConfigureComponent>;

  // 	Properties
  public _tempResults = [
    { data: [10, 8, 12, 14, 9, 10, 1], label: 'Success' },
    { data: [0, 0, 1, 0, 0, 2, 0], label: 'Error' }
  ];
  public lineChartColors: Color[] = [
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    {
      // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLabels: Label[] = [
    '1pm',
    '2pm',
    '3pm',
    '4pm',
    '5pm',
    '6pm',
    '7pm'
  ];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left'
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        }
      ]
    }
  };

  public get Module(): DataFlowModule {
    //  this.obj is managed by BasePortComponent
    return this.obj;
  }

  public ModuleShapes = DataFlowModuleShapeTypes;

  public get StatusColor(): string {
    if (
      !this.Module.Status ||
      (this.Module.Status &&
        this.Module.Status.Code !== 0 &&
        this.Module.Status.Code !== 100 &&
        this.Module.Status.Code !== -100)
    ) {
      return 'red';
    } else if (this.Module.Status && this.Module.Status.Code === -100) {
      return 'yellow';
    } else if (this.Module.Status && this.Module.Status.Code === 0) {
      return 'green';
    } else if (this.Module.Status && this.Module.Status.Code === 100) {
      return 'gray';
    }
  }

  public get StatusIconClass(): any {
    if (
      !this.Module.Status ||
      (this.Module.Status &&
        this.Module.Status.Code !== 0 &&
        this.Module.Status.Code !== 100 &&
        this.Module.Status.Code !== -100)
    ) {
      return { 'fa-exclamation-triangle': true, 'fa-5x': !this.ViewDetails };
    } else if (this.Module.Status && this.Module.Status.Code === -100) {
      return { 'fa-exclamation-triangle': true, 'fa-5x': !this.ViewDetails };
    } else if (this.Module.Status && this.Module.Status.Code === 0) {
      return { 'fa-check': true, 'fa-5x': !this.ViewDetails };
    } else if (this.Module.Status && this.Module.Status.Code === 100) {
      return { 'fa-circle-o-notch fa-spin': true, 'fa-5x': !this.ViewDetails };
    }
  }

  public get StatusText(): string {
    if (
      !this.Module.Status ||
      (this.Module.Status &&
        this.Module.Status.Code !== 0 &&
        this.Module.Status.Code !== 100 &&
        this.Module.Status.Code !== -100)
    ) {
      return 'Provisioned resource not located';
    } else if (this.Module.Status && this.Module.Status.Code === -100) {
      return 'Not yet provisioned';
    } else if (this.Module.Status && this.Module.Status.Code === 0) {
      return 'Successfully provisioned';
    } else if (this.Module.Status && this.Module.Status.Code === 100) {
      return 'Provisioning unavailable';
    }
  }

  public ViewDetails: boolean;

  // 	Constructors
  constructor(protected matDialog: MatDialog) {
    super();
  }

  // 	Runtime
  public ngAfterViewInit() {
    setTimeout(() => {
      this._tempResults = [...this._tempResults];
    }, 1000);
  }

  public ngOnInit() {}

  // 	API Methods
  public Abs(input: number) {
    return Math.abs(input);
  }

  public EditNodeName() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.Module;
    dialogConfig.disableClose = true;

    if (this.editNameDialogRef != null) {
      this.editNameDialogRef.close({});

      this.editNameDialogRef = null;
    }

    this.editNameDialogRef = this.matDialog.open(
      DialogBodyComponent,
      dialogConfig
    );

    this.editNameDialogRef.afterClosed().subscribe(value => {
      const mdul = {
        ...this.Module,
        Text: value.data
      };

      if (mdul.Text && mdul.Text.length > 2) {
        this.toolkit.updateNode(this.obj, mdul);
      }
    });
  }

  public ManageModule() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      Module: this.Module
    };

    // dialogConfig.disableClose = true;

    if (this.configureDialogRef != null) {
      this.configureDialogRef.close({});

      this.configureDialogRef = null;
    }

    this.configureDialogRef = this.matDialog.open(
      DialogModuleConfigureComponent,
      dialogConfig
    );

    this.configureDialogRef.afterClosed().subscribe(value => {
      const mdul = {
        ...value
      };

      if (mdul) {
        this.toolkit.updateNode(this.obj, mdul);
      }
    });
  }

  public OpenModuleQuickView() {
    this.ToggleViewDetails();
  }

  public RemoveNode() {
    if (this.Module != null && confirm(`Delete '${this.Module.Text}'?`)) {
      this.toolkit.removeNode(this.obj);
    }
  }

  public ToggleViewDetails() {
    this.ViewDetails = !this.ViewDetails;
  }

  // 	Helpers
}
