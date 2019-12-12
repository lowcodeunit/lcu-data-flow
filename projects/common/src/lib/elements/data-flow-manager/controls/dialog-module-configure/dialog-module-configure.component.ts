import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DataFlowModule,
  DataFlowModulePack,
  LCUElementContext
} from '@lcu/common';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';

export class DialogModuleConfigureSettings {
  public Pack: DataFlowModulePack;

  public Module: DataFlowModule;
}

@Component({
  selector: 'lcu-dialog-module-configure',
  templateUrl: './dialog-module-configure.component.html',
  styleUrls: ['./dialog-module-configure.component.scss']
})
export class DialogModuleConfigureComponent implements OnInit {
  //  Helpers

  //  Properties
  public Config: LazyElementConfig;

  public Context: LCUElementContext<any>;

  public Module: DataFlowModule;

  //  Constructors
  constructor(
    protected dialogRef: MatDialogRef<DialogModuleConfigureComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogModuleConfigureSettings
  ) {}

  //  Life Cycle
  public ngOnInit() {
    this.Module = { ...this.data.Module };

    this.Config = {
      Assets: [this.Module.Display.Toolkit],
      ElementName: this.Module.Display.Element
    };

    const settings = this.Module.Settings || {};

    const status: any = this.Module.Status || {};

    const quickView: any = status.QuickView || {};

    const state = {...settings, Chart: quickView.Chart };

    this.Context = { State: state };
  }

  //  API Methods
  public Cancel(): void {
    this.dialogRef.close({ ...this.data.Module });
  }

  public Save(): void {
    this.dialogRef.close({ ...this.Module });
  }
}
