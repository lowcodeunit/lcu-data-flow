import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';
import {
  DataFlowModuleShapeTypes,
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

export class DataFlowModuleQuickView {
  public Chart: {
    Results: any[];
    Colors: Color[];
    Labels: Label[];
    Options: ChartOptions & { annotation: any };
  };
}

@Component({
  templateUrl: './data-flow-module.html'
})
export class DataFlowModuleComponent extends BaseNodeComponent
  implements AfterViewInit, OnInit {
  // 	Fields
  protected editNameDialogRef: MatDialogRef<DialogBodyComponent>;

  protected configureDialogRef: MatDialogRef<DialogModuleConfigureComponent>;

  // 	Properties
  public get Module(): DataFlowModule {
    //  this.obj is managed by BasePortComponent
    return this.obj;
  }

  public ModuleShapes = DataFlowModuleShapeTypes;

  public QuickView: DataFlowModuleQuickView;

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

  public get StatusDiameter(): number {
    return !this.ViewDetails ? 50 : 12;
  }

  public get StatusIconClass(): any {
    if (
      !this.Module.Status ||
      (this.Module.Status &&
        this.Module.Status.Code !== 0 &&
        this.Module.Status.Code !== 100 &&
        this.Module.Status.Code !== -100)
    ) {
      return 'warning';
    } else if (this.Module.Status && this.Module.Status.Code === -100) {
      return 'warning';
    } else if (this.Module.Status && this.Module.Status.Code === 0) {
      return 'check';
    } else if (this.Module.Status && this.Module.Status.Code === 100) {
      return 'sync';
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
      this.setQuickView();
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
  protected setQuickView() {
    const status = <any> this.Module.Status;

    if (status && status.QuickView && status.QuickView.Chart) {
      this.QuickView = <DataFlowModuleQuickView> status.QuickView;
    } else {
      this.QuickView = null;
    }
  }
}
